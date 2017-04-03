# TLS Proxying

To be able to intercept tls traffic Halland-Proxy generates and signs its own root certificate
which is used to generate certificates for different hosts on the fly.
Since th  root certificate is self signed it won't be trusted by your browsers, applications and devices.
Therefore you have to add the certificate to your computer/device certificate store.

## Trust the root certificate on your local machine

Click on the menu item "Install root cert" under the Tools menu option.

## Install and trust the root cert on your iOS device

1. Add Halland-Proxy as a http-proxy for your wifi-connection.
   Press the info-symbol on your wifi-connection and fill in the
   proxy information at the bottom.
2. Open Safari and go to http://bit.ly/hlnd-tls.
   If you have entered the proxy information correctly you will get
   an option to install the certificate otherwise you will come to
   this page.
3. Choose Install in the upper right corner and follow the guide.
4. The certificate is now installed but not yet trusted.
   Go to Settings -> General -> About -> Certificate Trust Settings
   and enable Halland Proxy CA.

