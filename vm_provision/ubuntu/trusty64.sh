#!/usr/bin/env bash


# Update 
sudo apt-get update

# Adjust timezone to be on eastern cost
sudo ln -fs /usr/share/zoneinfo/America/New_York localtime

sudo apt-get install lsb-core

#install nodejs
sudo curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
sudo apt-get install nodejs

sudo apt-get autoremove