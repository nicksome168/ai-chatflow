## How to zip the lambda function

define `requirements.txt` first

```bash
cd <lf_name>
mkdir package
pip install --target ./package -r requirements.txt
cp <lf_name>.py package/
zip -r <lf_name>.zip package/
```

## Opensearch example payload

All you need is inside `payload['hits']['hits']` object array. The data is in `_source` field within each object, and the data payload format is the same as the schema presented in the dynamodb table.

```json
{
  "took": 3,
  "timed_out": false,
  "_shards": {
    "total": 3,
    "successful": 3,
    "skipped": 0,
    "failed": 0
  },
  "hits": {
    "total": {
      "value": 110,
      "relation": "eq"
    },
    "max_score": 0.55129033,
    "hits": [
      {
       "_index": "...",
        "_id": "...",
        "_score": 0.55129033,
        "_source": {
            "<field1>": { "<type1>": "<val1>" },
            "<field2>": { "<type2>": "<val2>" },
            "<field3>": { "<type3>": "<val3>" },
            ...
        }
      },
      {
        "_index": "...",
        "_id": "...",
        "_score": 0.55129033,
        "_source": {
            "<field1>": { "<type1>": "<val1>" },
            "<field2>": { "<type2>": "<val2>" },
            "<field3>": { "<type3>": "<val3>" },
            ...
        }
      }
      ...
    ],
  }, // end of hits
  ...
} 
```
