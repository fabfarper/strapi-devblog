// @ts-ignore
import customLogo from './extensions/smile-logo.png';
const customPrimaryColor = '#2C97AD';

const config = {
  locales: ['fr'],
  translations: {
    fr: {
      'global.marketplace': 'Place de Marché',
    }
  },
  auth: {
    logo: customLogo
  },
  menu: {
    logo: customLogo
  },
  theme: {
    colors: {
      buttonPrimary600: customPrimaryColor,
      primary600: customPrimaryColor
    }
  }
};

const bootstrap = (app) => {
  console.log(app);
};

export default {
  config,
  bootstrap,
};
