Vagrant.configure(2) do |config|
  config.vm.box = "bento/ubuntu-18.04"

  config.vm.network :private_network, ip: "172.10.0.30", :netmask => "255.255.0.0"

  config.ssh.forward_agent = true

  config.vm.provision "shell", path: "_provision/script.sh"

end
