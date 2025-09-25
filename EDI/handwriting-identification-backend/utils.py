from PIL import Image, ImageFilter, ImageEnhance
import numpy as np
import os
from pathlib import Path
import cv2
from skimage import filters, morphology
import json
from datetime import datetime
import pymongo
from config import settings


def preprocess_handwriting_image(image_path: str, output_path: str = None, target_size=(512, 512)):
    """
    Enhanced preprocessing for handwriting images.
    """
    image = Image.open(image_path).convert('L')  # Grayscale

    # Resize
    image = image.resize(target_size, Image.Resampling.LANCZOS)

    # Enhance contrast using PIL
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.8)

    # Enhance sharpness
    sharpener = ImageEnhance.Sharpness(image)
    image = sharpener.enhance(2.0)

    # Apply adaptive thresholding for better text extraction
    image_array = np.array(image)
    thresh = filters.threshold_otsu(image_array)
    binary = image_array > thresh

    # Morphological operations to clean up
    binary = morphology.remove_small_objects(binary, min_size=50)
    binary = morphology.remove_small_holes(binary, area_threshold=50)

    # Convert back to PIL Image
    processed_image = Image.fromarray((binary * 255).astype(np.uint8))

    if output_path:
        processed_image.save(output_path)
        return output_path
    else:
        return processed_image


def preprocess_handwriting_image_cv2(image_path: str, output_path: str = None):
    """
    Alternative preprocessing using OpenCV for advanced image processing.
    """
    # Read image
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    # Noise reduction
    image = cv2.GaussianBlur(image, (3, 3), 0)

    # Contrast enhancement
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    image = clahe.apply(image)

    # Morphological operations
    kernel = np.ones((2, 2), np.uint8)
    image = cv2.morphologyEx(image, cv2.MORPH_CLOSE, kernel)

    # Adaptive thresholding
    image = cv2.adaptiveThreshold(
        image, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
    )

    if output_path:
        cv2.imwrite(output_path, image)
        return output_path
    else:
        return image


def save_uploaded_image(file, upload_dir="uploads", filename=None):
    """
    Save uploaded image file to disk with validation.
    """
    if not filename:
        filename = file.filename

    # Validate file extension
    allowed_extensions = {'.png', '.jpg', '.jpeg', '.bmp', '.tiff'}
    file_ext = Path(filename).suffix.lower()
    if file_ext not in allowed_extensions:
        raise ValueError(f"Unsupported file extension: {file_ext}")

    upload_path = Path(upload_dir)
    upload_path.mkdir(exist_ok=True)

    file_path = upload_path / filename
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    return str(file_path)


def get_image_features(image_path: str):
    """
    Extract features from preprocessed image.
    """
    from ai_model import extract_features

    with open(image_path, "rb") as f:
        image_bytes = f.read()

    return extract_features(image_bytes)


def create_training_dataset_from_samples(samples_dir="processed", output_file="training_data.json", save_to_db=False):
    """
    Create training dataset from collected handwriting samples.
    Optionally save to database.
    """
    training_data = []
    samples_path = Path(samples_dir)

    if not samples_path.exists():
        return training_data

    # Assuming samples are organized by person_id
    for person_dir in samples_path.iterdir():
        if person_dir.is_dir():
            person_id = person_dir.name
            for image_file in person_dir.glob("*"):
                if image_file.suffix.lower() in ['.png', '.jpg', '.jpeg']:
                    sample = {
                        'person_id': person_id,
                        'image_path': str(image_file),
                        'filename': image_file.name
                    }
                    training_data.append(sample)

    # Save to JSON
    with open(output_file, 'w') as f:
        json.dump(training_data, f, indent=2)

    # Optionally save to database
    if save_to_db:
        save_training_data_to_db(training_data)

    return training_data


def save_training_data_to_db(training_data):
    """
    Save training data to MongoDB.
    """
    client = pymongo.MongoClient(settings.mongo_uri)
    db = client[settings.database_name]
    collection = db['training_data']

    for sample in training_data:
        sample_dict = sample.copy()
        sample_dict['date_added'] = datetime.utcnow()
        collection.insert_one(sample_dict)

    client.close()


def load_training_data_from_db():
    """
    Load training data from MongoDB.
    """
    client = pymongo.MongoClient(settings.mongo_uri)
    db = client[settings.database_name]
    collection = db['training_data']

    training_data = list(collection.find({}, {'_id': 0}))
    client.close()

    return training_data


def split_training_data(training_data, train_ratio=0.7, val_ratio=0.2):
    """
    Split training data into train/validation/test sets.
    """
    np.random.shuffle(training_data)

    n_total = len(training_data)
    n_train = int(n_total * train_ratio)
    n_val = int(n_total * val_ratio)

    train_data = training_data[:n_train]
    val_data = training_data[n_train:n_train + n_val]
    test_data = training_data[n_train + n_val:]

    return train_data, val_data, test_data


def augment_training_images(training_data, output_dir="augmented", augmentations_per_image=5):
    """
    Create augmented versions of training images.
    """
    from ai_model import preprocess_image_advanced

    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)

    augmented_data = []

    for sample in training_data:
        person_id = sample['person_id']
        image_path = sample['image_path']

        # Create person directory
        person_dir = output_path / person_id
        person_dir.mkdir(exist_ok=True)

        # Load original image
        with open(image_path, 'rb') as f:
            image_bytes = f.read()

        # Save original
        original_filename = Path(image_path).name
        original_output = person_dir / original_filename
        with open(original_output, 'wb') as f:
            f.write(image_bytes)

        augmented_data.append({
            'person_id': person_id,
            'image_path': str(original_output),
            'augmented': False
        })

        # Create augmentations
        for i in range(augmentations_per_image):
            augmented_image = preprocess_image_advanced(image_bytes, augment=True)
            aug_filename = f"aug_{i}_{original_filename}"
            aug_path = person_dir / aug_filename

            # Convert back to PIL and save
            aug_pil = Image.fromarray((augmented_image[0, :, :, 0] * 255).astype(np.uint8))
            aug_pil.save(aug_path)

            augmented_data.append({
                'person_id': person_id,
                'image_path': str(aug_path),
                'augmented': True
            })

    return augmented_data


def analyze_image_quality(image_path: str):
    """
    Analyze image quality metrics for handwriting samples.
    """
    image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)

    # Calculate metrics
    brightness = np.mean(image)
    contrast = image.std()
    sharpness = cv2.Laplacian(image, cv2.CV_64F).var()

    # Estimate text density
    _, binary = cv2.threshold(image, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    text_density = np.sum(binary == 0) / binary.size

    return {
        'brightness': brightness,
        'contrast': contrast,
        'sharpness': sharpness,
        'text_density': text_density,
        'image_shape': image.shape
    }


def batch_preprocess_images(input_dir: str, output_dir: str, method="pil"):
    """
    Batch preprocess all images in a directory.
    """
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    output_path.mkdir(exist_ok=True)

    processed_files = []

    for image_file in input_path.glob("*"):
        if image_file.suffix.lower() in ['.png', '.jpg', '.jpeg', '.bmp', '.tiff']:
            output_file = output_path / f"processed_{image_file.name}"

            if method == "pil":
                preprocess_handwriting_image(str(image_file), str(output_file))
            elif method == "cv2":
                preprocess_handwriting_image_cv2(str(image_file), str(output_file))

            processed_files.append(str(output_file))

    return processed_files


def delete_training_data_from_db(data_id: str):
    """
    Delete training data by data_id.
    """
    client = pymongo.MongoClient(settings.mongo_uri)
    db = client[settings.database_name]
    collection = db['training_data']

    result = collection.delete_one({"data_id": data_id})

    client.close()
    return result.deleted_count > 0
