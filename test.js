const AWS = require('aws-sdk')
const fs = require('fs')

//TODO set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY env variables
const lambda = new AWS.Lambda({
  //TODO
  region: 'us-west-1'
})

lambda.invoke({
  //TODO
  FunctionName: 'jsreportfunction',
  Payload: JSON.stringify({
    renderRequest: {
      template: {
        name: 'main-book'
      },
      data: {
        "result": {
          "title": "Updating NEW DATA DPU Software Packages Using Standard Linux Tools",
          "topicId": "updating_dpu_software_packages_using_standard_linux_tools",
          "figures": [],
          "table": [],
          "body": "<div>\n <p>As an alternative to BFB installation, it is possible to upgrade DPU software using standard Linux tools (i.e., APT in case of DEB-based distributions, YUM for RPM based distributions).</p> \n <p>Public DOCA repositories are available under <a class=\"external-link\" href=\"https://linux.mellanox.com/public/repo/doca/\">https://linux.mellanox.com/public/repo/doca/</a>.</p> \n <p> For Ubuntu 20.04 this DOCA repository is configured in the <tt class=\" \">doca.list</tt> file: </p> \n <div>\n  <div class=\"code-body text/plain\"> \n   <div class=\"code-line\">\n     # cat /etc/apt/sources.list.d/doca.list \n   </div> \n   <div class=\"code-line\">\n     # \n   </div> \n   <div class=\"code-line\">\n     # Nvidia DOCA public repository configuration file. \n   </div> \n   <div class=\"code-line\">\n     # For more information, refer to http://linux.mellanox.com \n   </div> \n   <div class=\"code-line\">\n     # \n   </div> \n   <div class=\"code-line\">\n     # To add a public key: \n   </div> \n   <div class=\"code-line\">\n     # wget -qO - https://linux.mellanox.com/public/repo/doca/lts/latest/ubuntu20.04/aarch64/GPG-KEY-Mellanox.pub | sudo apt-key add - \n   </div> \n   <div class=\"code-line\">\n     # deb [trusted=yes] https://linux.mellanox.com/public/repo/doca/lts/latest/ubuntu20.04/aarch64 ./ \n   </div>\n  </div>\n </div> \n <p> When a new NVIDIA software release is available, run the following commands to update your software packages to the new versions: </p> \n <div>\n  <div class=\"code-body text/plain\"> \n   <div class=\"code-line\">\n     $ wget -qO - https://linux.mellanox.com/public/repo/doca/lts/latest/ubuntu20.04/aarch64/GPG-KEY-Mellanox.pub | sudo apt-key add - \n   </div> \n   <div class=\"code-line\">\n     $ apt update \n   </div> \n   <div class=\"code-line\">\n     $ apt upgrade \n   </div>\n  </div>\n </div> \n <p>After the software packages are updated, it is required to upgrade Boot Software (UEFI/ATF) and NIC firmware.</p> \n <p>To upgrade UEFI/ATF (included in mlxbf-bootimages DEB package) on boot partition, run:</p> \n <div>\n  <div class=\"code-body text/plain\"> \n   <div class=\"code-line\">\n     $ bfrec --bootctl --policy dual \n   </div> \n   <div class=\"code-line\">\n     $ bfrec --capsule /lib/firmware/mellanox/boot/capsule/boot_update2.cap --policy dual \n   </div> \n   <div class=\"code-line\">\n     $ reboot \n   </div>\n  </div>\n </div> \n <div class=\"call-out-box option-note\">\n  <div class=\"call-out-box-title\">\n    Note \n  </div>\n  <div class=\"call-out-box-body\"> \n   <p>To upgrade the DPU software to DOCA_1.5.1_BSP_3.9.3_Ubuntu_20.04-4.2211-LTS version from DOCA_1.5.0_BSP_3.9.3_Ubuntu_20.04-11:</p> \n   <ol class=\" \"> \n    <li class=\" \"><p>Run the following:</p> \n     <div>\n      <div class=\"code-body text/plain\"> \n       <div class=\"code-line\">\n         $ wget -qO - https://linux.mellanox.com/public/repo/doca/lts/latest/ubuntu20.04/aarch64/GPG-KEY-Mellanox.pub | sudo apt-key add - \n       </div> \n       <div class=\"code-line\">\n         $ sudo apt update \n       </div> \n       <div class=\"code-line\">\n         $ sudo apt-mark hold linux-tools-bluefield linux-image-bluefield linux-bluefield linux-headers-bluefield linux-libc-dev linux-tools-common \n       </div> \n       <div class=\"code-line\">\n         $ sudo apt upgrade \n       </div>\n      </div>\n     </div> </li> \n    <li class=\" \"><p>Download and install the <tt class=\" \">mlxbf-bootimages</tt> DEB file which includes the DPU's UEFI/ATF and set the right image type (\"dev\" vs \"prod\"):</p> \n     <div>\n      <div class=\"code-body text/plain\"> \n       <div class=\"code-line\">\n         $ IMAGE_TYPE=dev \n       </div> \n       <div class=\"code-line\">\n         $ wget -P /tmp -r --no-verbose --no-directories -l1 --no-parent -A 'mlxbf-bootimages_*_arm64.deb' https://linux.mellanox.com/public/repo/bluefield/latest/bootimages/${IMAGE_TYPE}/ \n       </div> \n       <div class=\"code-line\">\n         $ dpkg -i /tmp/mlxbf-bootimages_*_arm64.deb \n       </div>\n      </div>\n     </div> </li> \n    <li class=\" \"><p>Upgrade UEFI/ATF (included in <tt class=\" \">mlxbf-bootimages</tt> DEB package) on the boot partition, run:</p> \n     <div>\n      <div class=\"code-body text/plain\"> \n       <div class=\"code-line\">\n         $ bfrec --bootctl --policy dual \n       </div> \n       <div class=\"code-line\">\n         $ bfrec --capsule /lib/firmware/mellanox/boot/capsule/boot_update2.cap --policy dual \n       </div> \n       <div class=\"code-line\">\n         $ reboot \n       </div>\n      </div>\n     </div> </li> \n    <li class=\" \"><p>Update NIC firmware according to section \"<a href=\"BlueFieldDPUOSLatest/Deploying+BlueField+Software+Using+BFB+from+Host#src-80580925_DeployingBlueFieldSoftwareUsingBFBfromHost-FirmwareUpgrade\">Firmware Upgrade</a>\".</p> </li> \n   </ol> \n  </div>\n </div>\n</div>",
          "topicPages": [],
          "date": "05/17/2024"
        },
        "status": "ok"
      },
    }
  })
}, (err, res) => {
  if (err) {
    return console.error(err)
  }
  
  const response = JSON.parse(res.Payload)
  if (response.errorMessage) {
    console.log(response.errorMessage)
    console.log(response.stackTrace)
  } else {
    fs.writeFileSync('report.pdf', Buffer.from(response.body, 'base64'))
  }
})