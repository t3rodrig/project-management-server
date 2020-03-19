#!/bin/bash

curl --location --request POST 'localhost:3000/api/projects' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'title=Learn React' \
--data-urlencode 'description=Get React skills and build killing final project app'
