"""

Copyright 2017, Institute for Systems Biology

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

"""


BIGQUERY_CONFIG = {
    "tables": [
        {
            "table_id": "isb-cgc:TARGET_bioclin_v0.Clinical",
            "biospecimen_table_id": "isb-cgc:TARGET_bioclin_v0.Biospecimen",
            "internal_table_id": "target_clinical",
            "program": "target"
        },
        {
            "table_id": "isb-cgc:TARGET_bioclin_v0.Biospecimen",
            "biospecimen_table_id": "isb-cgc:TARGET_bioclin_v0.Biospecimen",
            "internal_table_id": "target_biospecimen",
            "program": "target"
        },
        {
            "table_id": "isb-cgc:TCGA_bioclin_v0.Clinical",
            "biospecimen_table_id": "isb-cgc:TCGA_bioclin_v0.Biospecimen",
            "internal_table_id": "tcga_clinical",
            "program": "tcga"
        },
        {
            "table_id": "isb-cgc:TCGA_bioclin_v0.Biospecimen",
            "biospecimen_table_id": "isb-cgc:TCGA_bioclin_v0.Biospecimen",
            "internal_table_id": "tcga_biospecimen",
            "program": "tcga"
        }
    ]
}
