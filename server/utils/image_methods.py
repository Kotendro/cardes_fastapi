from PIL import Image
from fastapi import UploadFile
from core.settings import settings
from core.exceptions import ImageProcessingError
from pathlib import Path
from io import BytesIO
from shutil import rmtree

def save_big_image(img_bytes, folder: Path):
    folder.mkdir(parents=True, exist_ok=True)
    
    with Image.open(BytesIO(img_bytes)) as processing:
        processing = processing.convert("RGB")
        processing.thumbnail((1200, 900))
    
        path = folder / "big.jpg"
        processing.save(path, format="JPEG")

def save_thumb(img_bytes, folder: Path):
    folder.mkdir(parents=True, exist_ok=True)
    
    with Image.open(BytesIO(img_bytes)) as processing:
        processing = processing.convert("RGB")
        processing.thumbnail((400, 300))
    
        path = folder / "thumb.jpg"
        processing.save(path, format="JPEG")
    
    
async def save_images(image: UploadFile, item_id):
    folder_path = Path(settings.paths.image) / str(item_id)
    try:
        img_bytes = await image.read()
        save_big_image(img_bytes, folder=folder_path)
        save_thumb(img_bytes, folder=folder_path)
    except:
        if folder_path.exists():
            rmtree(folder_path)
        raise ImageProcessingError("Bad image")

def del_images(item_id):
    folder_path = Path(settings.paths.image) / str(item_id)
    if folder_path.exists():
        rmtree(folder_path)