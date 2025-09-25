# handwriting_model.py

import os
import torch
import torch.nn as nn
from torchvision import models, transforms
from torch.utils.data import DataLoader, Dataset
from PIL import Image
import numpy as np
from pymongo import MongoClient
from sklearn.metrics.pairwise import cosine_similarity

# GPU check
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# MongoDB setup
client = MongoClient("mongodb://localhost:27017")
db = client["handwriting_identification"]
embeddings_collection = db["embeddings"]

# Image preprocessing and augmentation
transform = transforms.Compose([
    transforms.Grayscale(num_output_channels=3),
    transforms.Resize((224, 224)),
    transforms.RandomRotation(10),
    transforms.RandomHorizontalFlip(),
    transforms.ToTensor(),
    transforms.Normalize([0.5]*3, [0.5]*3)
])

class HandwritingDataset(Dataset):
    def __init__(self, dataset_path, transform):
        self.samples = []
        self.labels = []
        self.label_map = {}
        self.transform = transform
        for idx, writer in enumerate(os.listdir(dataset_path)):
            writer_path = os.path.join(dataset_path, writer)
            if os.path.isdir(writer_path):
                self.label_map[idx] = writer
                for img_name in os.listdir(writer_path):
                    img_path = os.path.join(writer_path, img_name)
                    self.samples.append(img_path)
                    self.labels.append(idx)
    def __len__(self):
        return len(self.samples)
    def __getitem__(self, idx):
        img = Image.open(self.samples[idx]).convert("RGB")
        img = self.transform(img)
        label = self.labels[idx]
        return img, label

class HandwritingNet(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        self.base = models.resnet18(pretrained=True)
        self.base.fc = nn.Linear(self.base.fc.in_features, 128)  # Embedding size
        self.classifier = nn.Linear(128, num_classes)
    def forward(self, x):
        features = self.base(x)
        out = self.classifier(features)
        return out, features

def train_model(dataset_path, epochs=10, batch_size=16, lr=1e-3):
    dataset = HandwritingDataset(dataset_path, transform)
    loader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
    num_classes = len(dataset.label_map)
    model = HandwritingNet(num_classes).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    model.train()
    for epoch in range(epochs):
        total_loss = 0
        for imgs, labels in loader:
            imgs, labels = imgs.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs, _ = model(imgs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch+1}/{epochs}, Loss: {total_loss/len(loader):.4f}")
    torch.save(model.state_dict(), "handwriting_model.pth")
    # Save label map for later use
    np.save("label_map.npy", dataset.label_map)
    print("Training complete. Model and label map saved.")
    return model, dataset.label_map

def get_embedding(model, image_path):
    model.eval()
    img = Image.open(image_path).convert("RGB")
    img = transform(img).unsqueeze(0).to(device)
    with torch.no_grad():
        _, embedding = model(img)
    return embedding.cpu().numpy().flatten()

def save_embeddings(dataset_path):
    # Load model and label map
    model = HandwritingNet(1)  # num_classes not needed for embedding
    model.load_state_dict(torch.load("handwriting_model.pth", map_location=device))
    model.to(device)
    label_map = np.load("label_map.npy", allow_pickle=True).item()
    # Clear previous embeddings
    embeddings_collection.delete_many({})
    for idx, writer in label_map.items():
        writer_path = os.path.join(dataset_path, writer)
        for img_name in os.listdir(writer_path):
            img_path = os.path.join(writer_path, img_name)
            emb = get_embedding(model, img_path)
            embeddings_collection.insert_one({
                "writer_id": writer,
                "embedding": emb.tolist(),
                "img_path": img_path
            })
    print("Embeddings saved to MongoDB.")

def match_sample(image_path, top_k=1):
    # Load model
    model = HandwritingNet(1)
    model.load_state_dict(torch.load("handwriting_model.pth", map_location=device))
    model.to(device)
    # Get embedding for input image
    query_emb = get_embedding(model, image_path)
    # Fetch all embeddings from DB
    all_embeddings = list(embeddings_collection.find({}))
    if not all_embeddings:
        return None
    db_embs = np.array([e["embedding"] for e in all_embeddings])
    similarities = cosine_similarity([query_emb], db_embs)[0]
    best_idx = np.argmax(similarities)
    best_match = all_embeddings[best_idx]
    return best_match["writer_id"]

# Example usage:
# model, label_map = train_model("dataset/")
# save_embeddings("dataset/")
# writer_id = match_sample("test_sample.png")