import barcode
from barcode.writer import ImageWriter
import io

def generate_barcode(sku: str) -> bytes:
    CODE = barcode.get_barcode_class('code128')
    code = CODE(sku, writer=ImageWriter())
    buffer = io.BytesIO()
    code.write(buffer)
    return buffer.getvalue()