## How to zip the lambda function
define `requirements.txt` first
```bash 
cd <lf_name>
mkdir package
pip install --target ./package -r requirements.txt
cp <lf_name>.py package/
zip -r <lf_name>.zip package/
```