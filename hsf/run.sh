#!/bin/bash


read -p "Input Month : " month

for date in $(seq 1 31)
do
     node getDayData.js $month $date
done

#node linescoreAggregate.js