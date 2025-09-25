import tensorflow as tf
from tensorflow.keras import layers, models, optimizers, callbacks
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import io
import os
from pathlib import Path
import json
from datetime import datetime
import cv2


def build_siamese_model(input_shape=(128, 128, 1), architecture="enhanced"):
    """
    Build a Siamese CNN for handwriting feature extraction.
    Options: 'simple' or 'enhanced'
    """
    def create_base_network(input_shape):
        if architecture == "simple":
            model = models.Sequential()
            model.add(layers.Input(shape=input_shape))
            model.add(layers.Conv2D(32, (3, 3), activation='relu', padding='same'))
            model.add(layers.MaxPooling2D((2, 2)))
            model.add(layers.Conv2D(64, (3, 3), activation='relu', padding='same'))
            model.add(layers.MaxPooling2D((2, 2)))
            model.add(layers.Flatten())
            model.add(layers.Dense(128, activation='relu'))  # Feature vector
        else:  # enhanced
            model = models.Sequential()
            model.add(layers.Input(shape=input_shape))
            model.add(layers.Conv2D(64, (3, 3), activation='relu', padding='same'))
            model.add(layers.BatchNormalization())
            model.add(layers.MaxPooling2D((2, 2)))
            model.add(layers.Dropout(0.25))

            model.add(layers.Conv2D(128, (3, 3), activation='relu', padding='same'))
            model.add(layers.BatchNormalization())
            model.add(layers.MaxPooling2D((2, 2)))
            model.add(layers.Dropout(0.25))

            model.add(layers.Conv2D(256, (3, 3), activation='relu', padding='same'))
            model.add(layers.BatchNormalization())
            model.add(layers.MaxPooling2D((2, 2)))
            model.add(layers.Dropout(0.25))

            model.add(layers.Conv2D(512, (3, 3), activation='relu', padding='same'))
            model.add(layers.BatchNormalization())
            model.add(layers.MaxPooling2D((2, 2)))
            model.add(layers.Dropout(0.25))

            model.add(layers.Flatten())
            model.add(layers.Dense(512, activation='relu'))
            model.add(layers.BatchNormalization())
            model.add(layers.Dropout(0.5))
            model.add(layers.Dense(256, activation='relu'))
            model.add(layers.BatchNormalization())
            model.add(layers.Dropout(0.3))
            model.add(layers.Dense(128, activation='relu'))  # Feature vector
        return model

    input_a = layers.Input(shape=input_shape)
    input_b = layers.Input(shape=input_shape)

    base_network = create_base_network(input_shape)

    processed_a = base_network(input_a)
    processed_b = base_network(input_b)

    # Compute L1 distance
    distance = layers.Lambda(lambda tensors: tf.abs(tensors[0] - tensors[1]))([processed_a, processed_b])
    outputs = layers.Dense(1, activation='sigmoid')(distance)

    model = models.Model([input_a, input_b], outputs)
    return model, base_network


# Global model instances
siamese_model, feature_extractor = build_siamese_model()


def create_data_generator():
    """
    Create data generator for training with augmentation.
    """
    return ImageDataGenerator(
        rotation_range=10,
        width_shift_range=0.1,
        height_shift_range=0.1,
        shear_range=0.1,
        zoom_range=0.1,
        horizontal_flip=False,  # Important for handwriting
        vertical_flip=False,
        fill_mode='nearest',
        rescale=1./255
    )


def deskew_image(image_array):
    """
    Deskew the image to correct for tilt.
    """
    coords = np.column_stack(np.where(image_array > 0))
    if len(coords) < 4:
        return image_array  # Not enough points to deskew
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    (h, w) = image_array.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(image_array, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return rotated


def preprocess_image_advanced(image_bytes, target_size=(128, 128), augment=False, noise_reduction=False, deskew=False):
    """
    Advanced image preprocessing with augmentation, noise reduction, and deskewing options.
    """
    image = Image.open(io.BytesIO(image_bytes)).convert('L')  # Grayscale

    # Resize
    image = image.resize(target_size, Image.Resampling.LANCZOS)

    # Convert to array for OpenCV operations
    image_array = np.array(image)

    # Deskew
    if deskew:
        image_array = deskew_image(image_array)
        image = Image.fromarray(image_array)  # Convert back to PIL

    # Noise reduction
    if noise_reduction:
        image_array = cv2.medianBlur(image_array, 3)  # Median blur for noise reduction
        image = Image.fromarray(image_array)  # Convert back to PIL

    # Enhance contrast
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.5)

    # Apply filters
    image = image.filter(ImageFilter.UnsharpMask(radius=1, percent=150, threshold=3))

    if augment:
        # Random augmentation
        if np.random.random() > 0.5:
            image = image.rotate(np.random.uniform(-5, 5))
        if np.random.random() > 0.7:
            image = ImageEnhance.Brightness(image).enhance(np.random.uniform(0.8, 1.2))

    image_array = np.array(image) / 255.0  # Normalize
    return np.expand_dims(image_array, axis=[0, -1])


def save_model(model_path="models"):
    """
    Save the trained model and feature extractor with versioning.
    """
    Path(model_path).mkdir(exist_ok=True)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # Load or initialize version
    version_file = f"{model_path}/versions.json"
    if os.path.exists(version_file):
        with open(version_file, 'r') as f:
            versions = json.load(f)
        version = versions.get('current_version', 0) + 1
    else:
        versions = {'current_version': 0, 'models': []}
        version = 1

    versions['current_version'] = version
    versions['models'].append({
        'version': version,
        'timestamp': timestamp,
        'model_path': f"{model_path}/siamese_model_v{version}_{timestamp}.h5",
        'feature_path': f"{model_path}/feature_extractor_v{version}_{timestamp}.h5",
        'metadata_path': f"{model_path}/model_metadata_v{version}_{timestamp}.json"
    })

    # Save full model
    model_path_full = f"{model_path}/siamese_model_v{version}_{timestamp}.h5"
    siamese_model.save(model_path_full)

    # Save feature extractor
    feature_path = f"{model_path}/feature_extractor_v{version}_{timestamp}.h5"
    feature_extractor.save(feature_path)

    # Save metadata
    metadata = {
        "version": version,
        "timestamp": timestamp,
        "model_path": model_path_full,
        "feature_path": feature_path,
        "input_shape": siamese_model.input_shape[0][1:],
        "feature_dim": feature_extractor.output_shape[1]
    }

    metadata_path = f"{model_path}/model_metadata_v{version}_{timestamp}.json"
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)

    # Save versions
    with open(version_file, 'w') as f:
        json.dump(versions, f, indent=2)

    return version, timestamp


def load_model(model_timestamp, model_path="models"):
    """
    Load a saved model by timestamp.
    """
    global siamese_model, feature_extractor

    metadata_path = f"{model_path}/model_metadata_{model_timestamp}.json"
    with open(metadata_path, 'r') as f:
        metadata = json.load(f)

    siamese_model = models.load_model(metadata["model_path"])
    feature_extractor = models.load_model(metadata["feature_path"])

    return metadata


def create_training_pairs(person_samples, negative_ratio=1.0):
    """
    Create positive and negative pairs for training.
    """
    pairs = []
    labels = []

    # Group samples by person
    person_groups = {}
    for sample in person_samples:
        person_id = sample['person_id']
        if person_id not in person_groups:
            person_groups[person_id] = []
        person_groups[person_id].append(sample['image_path'])

    persons = list(person_groups.keys())

    # Create positive pairs (same person)
    for person_id, samples in person_groups.items():
        if len(samples) < 2:
            continue
        for i in range(len(samples)):
            for j in range(i+1, len(samples)):
                pairs.append((samples[i], samples[j]))
                labels.append(1)  # Similar

    # Create negative pairs (different persons)
    num_negatives = int(len(pairs) * negative_ratio)
    for _ in range(num_negatives):
        person1, person2 = np.random.choice(persons, 2, replace=False)
        sample1 = np.random.choice(person_groups[person1])
        sample2 = np.random.choice(person_groups[person2])
        pairs.append((sample1, sample2))
        labels.append(0)  # Dissimilar

    return pairs, labels


def train_model(training_data, epochs=50, batch_size=32, validation_split=0.2, learning_rate=0.001, tune_hyperparams=False):
    """
    Train the Siamese model with training data.
    Enhanced with hyperparameter tuning option.
    """
    if tune_hyperparams:
        # Simple hyperparameter tuning
        best_lr = learning_rate
        best_acc = 0
        for lr in [0.001, 0.0005, 0.0001]:
            siamese_model.compile(
                optimizer=optimizers.Adam(learning_rate=lr),
                loss='binary_crossentropy',
                metrics=['accuracy']
            )
            # Quick training to test
            pairs, labels = create_training_pairs(training_data)
            if len(pairs) == 0:
                continue
            X1 = []
            X2 = []
            y = []
            for (img1_path, img2_path), label in zip(pairs[:100], labels[:100]):  # Use subset for tuning
                try:
                    img1 = preprocess_image_advanced(open(img1_path, 'rb').read())
                    img2 = preprocess_image_advanced(open(img2_path, 'rb').read())
                    X1.append(img1[0])
                    X2.append(img2[0])
                    y.append(label)
                except:
                    continue
            if len(X1) == 0:
                continue
            X1 = np.array(X1)
            X2 = np.array(X2)
            y = np.array(y)
            history = siamese_model.fit([X1, X2], y, epochs=5, batch_size=batch_size, verbose=0)
            acc = history.history['accuracy'][-1]
            if acc > best_acc:
                best_acc = acc
                best_lr = lr
        learning_rate = best_lr
        print(f"Best learning rate: {best_lr}")

    # Compile model with best or given learning rate
    siamese_model.compile(
        optimizer=optimizers.Adam(learning_rate=learning_rate),
        loss='binary_crossentropy',
        metrics=['accuracy']
    )

    # Create pairs
    pairs, labels = create_training_pairs(training_data)

    # Prepare data generators
    datagen = create_data_generator()

    # Create training data with augmentation
    X1 = []
    X2 = []
    y = []

    for (img1_path, img2_path), label in zip(pairs, labels):
        # Load and preprocess images with random augmentation
        augment1 = np.random.random() > 0.5
        augment2 = np.random.random() > 0.5
        img1 = preprocess_image_advanced(open(img1_path, 'rb').read(), augment=augment1)
        img2 = preprocess_image_advanced(open(img2_path, 'rb').read(), augment=augment2)

        X1.append(img1[0])
        X2.append(img2[0])
        y.append(label)

    X1 = np.array(X1)
    X2 = np.array(X2)
    y = np.array(y)

    # Callbacks
    callbacks_list = [
        callbacks.EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True),
        callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=5),
        callbacks.ModelCheckpoint('models/best_model.h5', monitor='val_accuracy', save_best_only=True)
    ]

    # Train
    history = siamese_model.fit(
        [X1, X2], y,
        epochs=epochs,
        batch_size=batch_size,
        validation_split=validation_split,
        callbacks=callbacks_list,
        verbose=1
    )

    # Save trained model
    version, timestamp = save_model()

    return history, version, timestamp


def evaluate_model(test_data):
    """
    Evaluate model performance on test data.
    """
    pairs, labels = create_training_pairs(test_data)

    predictions = []
    for img1_path, img2_path in pairs:
        img1 = preprocess_image_advanced(open(img1_path, 'rb').read())
        img2 = preprocess_image_advanced(open(img2_path, 'rb').read())

        pred = siamese_model.predict([img1, img2])
        predictions.append(pred[0][0])

    predictions = np.array(predictions)
    labels = np.array(labels)

    # Calculate metrics
    from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

    # Convert predictions to binary
    pred_binary = (predictions > 0.5).astype(int)

    accuracy = accuracy_score(labels, pred_binary)
    precision = precision_score(labels, pred_binary)
    recall = recall_score(labels, pred_binary)
    f1 = f1_score(labels, pred_binary)
    auc = roc_auc_score(labels, predictions)
    cm = confusion_matrix(labels, pred_binary).tolist()

    return {
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1,
        'auc': auc,
        'confusion_matrix': cm
    }


def preprocess_image(image_bytes, target_size=(128, 128)):
    """
    Preprocess image for model input.
    """
    image = Image.open(io.BytesIO(image_bytes)).convert('L')  # Grayscale
    image = image.resize(target_size)
    image_array = np.array(image) / 255.0  # Normalize
    return np.expand_dims(image_array, axis=[0, -1])


def extract_features(image_bytes):
    """
    Extract feature vector from handwriting image.
    """
    processed_image = preprocess_image(image_bytes)
    features = feature_extractor.predict(processed_image)
    return features.flatten()


def compute_similarity(features1, features2):
    """
    Compute similarity score between two feature vectors.
    """
    # Cosine similarity
    dot_product = np.dot(features1, features2)
    norm1 = np.linalg.norm(features1)
    norm2 = np.linalg.norm(features2)
    similarity = dot_product / (norm1 * norm2)
    return float(similarity)


def match_handwriting(evidence_features, suspect_features_list):
    """
    Match evidence against list of suspect features.
    Returns list of (person_id, similarity_score) tuples.
    """
    matches = []
    for person_id, features in suspect_features_list:
        similarity = compute_similarity(evidence_features, features)
        matches.append((person_id, similarity))
    matches.sort(key=lambda x: x[1], reverse=True)  # Sort by similarity descending
    return matches
