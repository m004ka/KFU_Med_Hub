import type { ThemeConfig } from 'antd'

const theme: ThemeConfig = {
  token: {
    colorPrimary: '#45688e',
    colorPrimaryHover: '#6b8faf',
    colorPrimaryActive: '#2d4f6e',
    colorLink: '#45688e',
    colorLinkHover: '#6b8faf',

    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f5f7fa',
    colorBgElevated: '#ffffff',

    colorText: '#1a2b3c',
    colorTextSecondary: '#6b7a8d',
    colorTextTertiary: '#9aa5b4',
    colorTextQuaternary: '#c1cad5',

    colorBorder: '#d9e2ec',
    colorBorderSecondary: '#eef2f7',

    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeXL: 20,
    fontSizeHeading1: 32,
    fontSizeHeading2: 26,
    fontSizeHeading3: 20,

    borderRadius: 8,
    borderRadiusLG: 10,
    borderRadiusSM: 6,
    padding: 16,
    paddingLG: 24,
    paddingXL: 32,

    boxShadow: '0 1px 3px 0 rgba(0,0,0,.07), 0 1px 2px -1px rgba(0,0,0,.05)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0,0,0,.07), 0 2px 4px -2px rgba(0,0,0,.05)',

    motionDurationMid: '0.2s',
    motionDurationSlow: '0.3s',

    controlHeight: 38,
    controlHeightLG: 44,
  },
  components: {
    Layout: {
      siderBg: '#2d4f6e',
      triggerBg: '#243d54',
      headerBg: '#ffffff',
      headerHeight: 64,
      headerPadding: '0 24px',
    },
    Menu: {
      darkItemBg: '#2d4f6e',
      darkItemColor: 'rgba(255,255,255,0.75)',
      darkItemHoverColor: '#ffffff',
      darkItemSelectedColor: '#ffffff',
      darkItemSelectedBg: '#45688e',
      darkSubMenuItemBg: '#243d54',
      itemHeight: 44,
      iconSize: 17,
      collapsedIconSize: 18,
    },
    Button: {
      primaryShadow: 'none',
      defaultShadow: 'none',
    },
    Card: {
      paddingLG: 20,
    },
    Table: {
      headerBg: '#f5f7fa',
      headerColor: '#6b7a8d',
      rowHoverBg: '#f5f7fa',
    },
    Input: {
      activeShadow: '0 0 0 2px rgba(69,104,142,.12)',
    },
    Select: {
      optionSelectedBg: '#eef2f7',
    },
    Badge: {
      statusSize: 8,
    },
    Statistic: {
      titleFontSize: 13,
    },
  },
}

export default theme
