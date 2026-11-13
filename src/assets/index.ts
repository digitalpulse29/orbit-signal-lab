/**
 * Single entry point for every generated PNG.
 * ONLY the fixed asset-contract names exist - never invent another file name.
 */
export const assets = {
  bgGame: require('../../assets/bg_game.png'),
  logo: require('../../assets/logo.png'),
  iconHome: require('../../assets/icon_home.png'),
  iconPause: require('../../assets/icon_pause.png'),
  sprite1: require('../../assets/sprite_1.png'),
  sprite2: require('../../assets/sprite_2.png'),
  sprite3: require('../../assets/sprite_3.png'),
  sprite4: require('../../assets/sprite_4.png'),
  sprite5: require('../../assets/sprite_5.png'),
  buttonRect: require('../../assets/button_rect.png'),
  buttonRound: require('../../assets/button_round.png'),
};

/**
 * sprite_1 satellite dish | sprite_2 relay ring | sprite_3 beacon core
 * sprite_4 debris hazard  | sprite_5 amplifier crystal
 */
export const NODE_SPRITE = {
  satellite: assets.sprite1,
  relay: assets.sprite2,
  beacon: assets.sprite3,
  hazard: assets.sprite4,
  amplifier: assets.sprite5,
};
