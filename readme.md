# Cloundpass 

P2P file sharing software written in nodeJs

### Run locally
you will need [Vagrant](https://www.vagrantup.com/) and [VirtualBox](https://www.virtualbox.org/) installed on your machine

run ```vagrant up``` from terminal

2 machines will be initialized
```sh
machine_1 10.0.0.2
machine_2 10.0.0.3
```
In terminal
```vagrant ssh machine_1```
```vagrant ssh machine_2```

Machines will be able to communicate with each other, outside world but not with the host