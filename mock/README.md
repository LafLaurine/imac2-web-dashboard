## Install Mockoon

You need to install [mockoon](https://mockoon.com/). You can check the [documentation](https://mockoon.com/tutorials/)

## Import Mockoon environment

When mockoon is launched, you'll see a tab named ```Import/export```. Click on it and then ```Import from a file (JSON)```. Our environment is in this directory and is named ```mockoon-env.json```.

![imac2-web-dashboard-step1](./img/step1.jpg)

## Add your own route (your own call to the chosen API)

Let's imagine that you want to retrieve data from an [employment rate API](https://api.db.nomics.world/v22/series/Eurostat/cens_01ramigr?limit=1000&offset=0&q=&observations=1&align_periods=1&dimensions=%7B%22FREQ%22%3A%5B%22A%22%5D%2C%22resid%22%3A%5B%22CHG_OUT3%22%5D%7D)

The first step is to click on the ```Add route``` button. After that, you need to put your path to your API. Since we already set up the ```https://api.db.nomics.world/``` into the ```environment.js``` you only need to add the route following it. 
With this example, it will be ```v22/series/Eurostat/cens_01ramigr```. Don't put parameters (what comes after the ?) in this.

![imac2-web-dashboard-step2](./img/step2.jpg)

After this, you need to complete the body. For this part, if you are on Chrome, you can use the add-on [Advanced Rest Client](https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo) and if you're on Mozilla you can use the add-on [Rested](https://addons.mozilla.org/fr/firefox/addon/rested/)
For this example I will use Advanced Rest Client but it works the same for other multiple add-ons.

![imac2-web-dashboard-step2](./img/step3.jpg)
You make sure that your method is set to ```GET```, you enter your URL and the you send it. You'll get the response of the API in a much prettier way.
Copy that and pass it to the ```body``` of mockoon.

![imac2-web-dashboard-step2](./img/step4.jpg)

You are now ready to run your environment !

## Run your mockoon environment

You just need to click on the green arrow next to ```Add environment```

## Export your mockoon environment

Click on the tab named ```Import/export``` and then ```Export all environments to a file (JSON)```. You can replace the environment in this directory (name it ```mockoon-env.json```).
