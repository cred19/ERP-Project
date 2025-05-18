import pandas as pd
from io import BytesIO

def sales_to_excel(sales_data):
    df = pd.DataFrame(sales_data)
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False)
    return output.getvalue()

def inventory_to_excel(inventory_data):
    df = pd.DataFrame(inventory_data)
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False)
    return output.getvalue()