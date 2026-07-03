from PIL import Image, ImageOps
from fastapi import UploadFile
from src.core.settings import settings
from src.core.exceptions import ImageProcessingError
from pathlib import Path
from io import BytesIO
from shutil import rmtree

def save_big_image(img_bytes, folder: Path):
    folder.mkdir(parents=True, exist_ok=True)
    
    with Image.open(BytesIO(img_bytes)) as processing:
        # Убирает переворачивание картинки
        processing = ImageOps.exif_transpose(processing) 
        
        processing = processing.convert("RGB")
        processing.thumbnail((1200, 999999))
    
        path = folder / "big.jpg"
        processing.save(path, format="JPEG")

def save_thumb(img_bytes, folder: Path):
    folder.mkdir(parents=True, exist_ok=True)
    
    with Image.open(BytesIO(img_bytes)) as processing:
        processing = ImageOps.exif_transpose(processing)
        
        processing = processing.convert("RGB")
        processing.thumbnail((300, 999999))
    
        path = folder / "thumb.jpg"
        processing.save(path, format="JPEG")
    
    
async def save_images(image: UploadFile, card_id):
    folder_path = Path(settings.paths.static) / str(card_id)
    try:
        img_bytes = await image.read()
        save_big_image(img_bytes, folder=folder_path)
        save_thumb(img_bytes, folder=folder_path)
    except:
        if folder_path.exists():
            rmtree(folder_path)
        raise ImageProcessingError("Bad image")

def del_images(card_id):
    folder_path = Path(settings.paths.static) / str(card_id)
    if folder_path.exists():
        rmtree(folder_path)