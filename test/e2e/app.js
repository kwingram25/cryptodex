import path from 'path';
import webdriver from 'selenium-webdriver';
import { expect } from 'chai';

import { coinsInMenuOrder } from '../../app/constants/coins';
import { elementIds, defaultFavorites } from '../../app/constants/ui';
import { delay, startChromeDriver, buildWebDriver } from '../func';
// import footerStyle from 'components/Footer.css';
// import mainSectionStyle from 'components/MainSection.css';
// import todoItemStyle from 'components/TodoItem.css';
// import todoTextInputStyle from 'components/TodoTextInput.css';

import {
  startingCount,
  randomIndex,
  randomIndexKey,
} from '../../app/test/utils';
import testAddresses from '../../app/test/testAddresses';

const extensionId = 'bjpeejchoeodncbjpjkoemfaolpaolgp';

const {
  addButtonId,
  addressListItemName,
  addressListItemString,
  addressFormName,
  addressFormString,
  addressFormVerify,
  addressFormSubmit,
  addressListBase,
  addressOptionsEdit,
  addressOptionsDelete,
  allCurrenciesItem,
  coinsList,
  favoritesList,
  deleteDialogConfirm
} = elementIds;

// const randomKey = (obj, exclude = []) => {
//   const keys = Object.keys(obj);
//   const fn = () => keys[randomIndex(keys.length)];
//   let res = fn();
//   while (exclude.includes(res)) {
//     res = fn();
//   }
//   return res;
// };

const findList = driver =>
  driver.findElements(webdriver.By.css(`#${addressListBase} > li`));

const findFavorites = driver =>
  driver.findElements(webdriver.By.css(`#${favoritesList} > li`));

const findCoins = driver =>
  driver.findElements(webdriver.By.css(`#${coinsList} > li`));


const createAddress = async (driver, name, string) => {
  // add todo
  driver.findElement(webdriver.By.id(addButtonId))
    .click();
  await delay(1000);
  await driver.findElement(webdriver.By.id(addressFormName)).sendKeys(name);
  await driver.findElement(webdriver.By.id(addressFormString)).sendKeys(string);

  await driver.findElement(webdriver.By.id(addressFormVerify)).click();
  await delay(5000);

  await driver.findElement(webdriver.By.id(addressFormSubmit)).click();
  await delay(1000);

  const addresses = await findList(driver);
  return { address: addresses[addresses.length - 1], count: addresses.length };
};

const startEditingAddress = async (driver, index, newName, duplicate) => {
  const address = (await findList(driver))[index];
  const optionsButton = address.findElement(webdriver.By.css('button[aria-label="Options"]'));
  optionsButton.click();
  await delay(500);

  await driver.findElement(webdriver.By.id(addressOptionsEdit)).click();
  await delay(1000);

  const nameField = driver.findElement(webdriver.By.id(addressFormName));
  const addressField = driver.findElement(webdriver.By.id(addressFormString));

  await nameField.click();
  await nameField.clear();
  await nameField.sendKeys(newName);

  await addressField.click();
  await addressField.clear();
  await addressField.sendKeys(duplicate);
};

const continueEditingAddress = async (driver, newString) => {
  const addressField = driver.findElement(webdriver.By.id(addressFormString));

  await addressField.click();
  await addressField.clear();
  await addressField.sendKeys(newString);

  await driver.findElement(webdriver.By.id(addressFormVerify)).click();
  await delay(5000);

  await driver.findElement(webdriver.By.id(addressFormSubmit)).click();
  await delay(1000);
};

const deleteAddress = async (driver, index) => {
  const address = (await findList(driver))[index];
  const optionsButton = address.findElement(webdriver.By.css('button[aria-label="Options"]'));
  optionsButton.click();
  await delay(500);

  await driver.findElement(webdriver.By.id(addressOptionsDelete)).click();
  await delay(1000);

  await driver.findElement(webdriver.By.id(deleteDialogConfirm)).click();
  await delay(1000);
};

const switchTab = async (driver, tabIndex) => {
  const favorites = await findFavorites(driver);
  const tab = favorites[tabIndex];

  expect(tab).to.not.equal(undefined);

  await tab.click();
  await delay(500);
};

describe('window (popup) page', function test() {
  let driver;
  this.timeout(120000);

  let myFavorites = defaultFavorites;

  before(async () => {
    await startChromeDriver();
    const extPath = path.resolve('dev');
    driver = buildWebDriver(extPath);
    await driver.get(`chrome-extension://${extensionId}/app.html`);
  });

  after(async () => driver.quit());

  it('should open Cryptodex', async () => {
    const title = await driver.getTitle();
    expect(title).to.equal('Cryptodex');
  });

  it('should create new addresses', async () => {
    for (let i = 0; i < startingCount; i += 1) {
      const name = `My Bitcoin Wallet ${i}`;
      const string = testAddresses.bitcoin[i];
      const { address, count } = await createAddress(driver, name, string);
      expect(count).to.equal(i + 1);
      const resName = await address.findElement(webdriver.By.id(addressListItemName)).getText();
      expect(resName).to.equal(name);

      const resString = await address.findElement(webdriver.By.id(addressListItemString)).getText();
      expect(resString.replace(/\n/, '')).to.equal(string);
    }
  });

  it('should edit address', async () => {
    const newName = 'My Bitcoin Wallet EDITED';
    const newString = testAddresses.bitcoin[
      randomIndex(
        startingCount,
        testAddresses.bitcoin.length
      )
    ];

    const editAtIndex = randomIndex(0, startingCount);
    const duplicateIndex = randomIndex(0, startingCount, { not: [editAtIndex] });

    const duplicate = testAddresses.bitcoin[duplicateIndex];

    await startEditingAddress(driver, editAtIndex, newName, duplicate);
    await delay(1000);

    // console.log(submitButton.getAttribute('disabled'));

    const submitButton = driver.findElement(webdriver.By.id(addressFormSubmit));
    expect(Boolean(await submitButton.getAttribute('disabled'))).to.equal(true);

    await continueEditingAddress(driver, newString);

    const edited = (await findList(driver))[editAtIndex];
    const resName = await edited.findElement(webdriver.By.id(addressListItemName)).getText();
    const resString = await edited.findElement(webdriver.By.id(addressListItemString)).getText();

    expect(resName).to.equal(newName);
    expect(resString.replace(/\n/, '')).to.equal(newString);
  });

  it('should switch tab', async () => {
    const newTab = randomIndexKey(defaultFavorites, {
      not: 'bitcoin'
    });

    // console.log('switching to tab ' + newTab);

    await switchTab(driver, newTab);

    expect((await findList(driver)).length).to.equal(0);

    await switchTab(driver, defaultFavorites.indexOf('bitcoin'));

    expect((await findList(driver)).length).to.equal(startingCount);
  });


  it('should delete address', async () => {
    const toDelete = randomIndex(0, startingCount);

    const oldList = await findList(driver);

    await deleteAddress(driver, toDelete);

    const newList = await findList(driver);
    expect(newList.length).to.equal(startingCount - 1);
    if (toDelete < startingCount.length - 1) {
      expect(
        newList[toDelete].findElement(webdriver.By.tagName('p')).getText()
      ).to.equal(
        oldList[toDelete + 1].findElement(webdriver.By.tagName('p')).getText()
      );
    }
  });

  it('should favorite tab', async () => {
    await driver.findElement(webdriver.By.id(allCurrenciesItem)).click();

    await delay(1000);
    let coinsListLis = await findCoins(driver);

    const favoriteIndex = randomIndexKey(coinsInMenuOrder, {
      not: defaultFavorites
    });

    let btn = await coinsListLis[favoriteIndex].findElement(webdriver.By.tagName('button'));

    //console.log(await btn.getAttribute('data-favorite'));

    expect(
      await btn.getAttribute('data-favorite')
    ).to.equal(
      'false'
    );

    await btn.click();

    myFavorites.push(coinsInMenuOrder[favoriteIndex].code);

    coinsListLis = await findCoins(driver);
    btn = await coinsListLis[favoriteIndex].findElement(webdriver.By.tagName('button'));

    //console.log(await btn.getAttribute('data-favorite'));

    expect(
      await btn.getAttribute('data-favorite')
    ).to.equal(
      'true'
    );

    const favorites = await findFavorites(driver);

    expect(
      favorites.length
    ).to.equal(
      myFavorites.length
    );

    expect(
      (await favorites[favorites.length - 1].getText()).substr(2)
    ).to.equal(
      coinsInMenuOrder[favoriteIndex].name
    );
  });

  it('should unfavorite tab', async () => {
    const unfavorite = myFavorites[randomIndex(0, myFavorites.length)];

    myFavorites = myFavorites.filter(code => code !== unfavorite);

    const unfavoriteIndex = coinsInMenuOrder
      .reduce((prev, curr, i) => (curr.code === unfavorite ? i : prev), 0);

    let coinListLis = await findCoins(driver);

    const button = await coinListLis[unfavoriteIndex]
      .findElement(webdriver.By.tagName('button'));

    expect(
      await button.getAttribute('data-favorite')
    ).to.equal(
      'true'
    );

    button.click();

    coinListLis = await findCoins(driver);

    expect(
      await (await coinListLis[unfavoriteIndex].findElement(
        webdriver.By.tagName('button')
      )).getAttribute('data-favorite')
    ).to.equal(
      'false'
    );

    const favorites = await findFavorites(driver);

    expect(
      favorites.length
    ).to.equal(
      myFavorites.length
    );
  });
});
