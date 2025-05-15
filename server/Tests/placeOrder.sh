#!/bin/bash

declare url = "http://localhost:3000"
declare user_jwt = ""

curl -i -H "Authorization: Bearer ${user_jwt}" --json @- $url/api/v1/shipment < place_order.json

