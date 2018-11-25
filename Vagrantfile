# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  (1..2).each do |i|
    config.vm.define "machine_#{i}" do |machine|
      machine.vm.box = "ubuntu/trusty64"
      machine.vm.provision :shell, :path => "vm_provision/ubuntu/trusty64.sh"
      machine.vm.provider "virtualbox" do |vb|
        vb.gui = false
        vb.memory = "1024"
        vb.name = "cloudpass_machine_#{i}"
      end   
      # machines will only be able to communicate withing each other but not with the host
      machine.vm.network "private_network", ip: "10.0.0.#{i + 1}", virtualbox__intnet: true
    end
  end
end



