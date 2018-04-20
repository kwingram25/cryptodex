const testAddresses = {
  bitcoin: [
    '12ucu9bHLe2w2ahjibVtp3xmdcGkgUmX4A',
    '3FX8AAe7qTvbLorhKRc8ufGVrAatp7bUQP',
    '1AM2fYfpY3ZeMeCKXmN66haoWxvB89pJUx',
    '34YVEmmYUpCFxXjQskv7rdZGjxnSK41M7n',
    '1QhPxJK5LfFcSHukA6okrF2z9FbXCaDLe',
    '19myaBVKqaZFH3xLbR5pnMzDvhk9sPUqkp',
    '1LP3DhZp1gamwG81gR7t32JQJrjUJ1CPQe'
  ],
  ethereum: [
    '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be',
    '0x3f5ce5fbfe3e9af3971dd833d26ba9b5c936f0be'.toUpperCase(),
  ],
  'ethereum-classic': [
    '0xef6dc803b74f695bdb95cca11f8dba822f04c663',
    '0x6c6a28cfe2bd58563ac86431cf2623990345bd23'
  ],
  'bitcoin-cash': [
    '12ucu9bHLe2w2ahjibVtp3xmdcGkgUmX4A',
    '3FX8AAe7qTvbLorhKRc8ufGVrAatp7bUQP',
  ],
  ripple: [
    'rG2pEp6WtqLfThH8wsVM9XYYvy9wSe9Zqu',
    'rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq',
    'rchGBxcD1A1C2tdxF6papQYZ8kjRKMYcL',
  ],
  cardano: [
    'DdzFFzCqrhseu4gbwJWfwg94zJ2xPaewKAEkf3qD4SaShZ6EoeinKueZCr3LRqHxVJvXRKZXigTGUnSKDEwwqeRe4M6wk435JiYm9NLR',
    'DdzFFzCqrhsjxv943wCbUcKkjX2kPGNgYnMmBXZPydXh5SWxt4QkofFAkWCWJPARZVyX9tehYcB5XSd9ZZNWWJaPw8zaow4YoqCX5Rdk'
  ],
  litecoin: [
    'LTGXddvMudALXzHyUUHsPxyip6pj6hiAfH',
    'LKTiNMjo2EtVorKLwBJc8F27E8BKPsBoQM',
    'LSkoUTRF6fbVYKGycHe1sGbnRhcYwU53nt'
  ],
  monero: [
    '44AFFq5kSiGBoZ4NMDwYtN18obc8AemS33DBLWs3H7otXft3XjrpDtQGv7SqSsaBYBb98uNbr2VBBEt7f2wfn3RVGQBEP3A',
    '46E5ekYrZd5UCcmNuYEX24FRjWVMgZ1ob79cRViyfvLFZjfyMhPDvbuCe54FqLQvVCgRKP4UUMMW5fy3ZhVQhD1JLLufBtu'
  ],
  neo: [
    'AaoCpGnzyvY9j6SXrdqFZUYqqKAfRySWaq',
    'APSq8FzBSPPYW3wicvLQaJTf8jB8dMQ3qw'
  ],
  stellar: [
    'GCY7UJGPQR6TL4DPWKFIXWGDE4HLSB7ZFKIBLQLJEOSGYLMG5565QZ3X',
    'GBOEEVARKVASOQSSXCAHNTGJTVALJE2QM3AQQ2K3VXACQ6JJREQRJZKB',
    'GAHK7EEG2WWHVKDNT4CEQFZGKF2LGDSW2IVM4S5DP42RBW3K6BTODB4A',
  ],
  iota: [
    'TWDBWUMKYYKPMIJU9I9QOGHSDMAGCYFFGZQVXEBYBMWBPGPYPIGQSMXHMFWMKLNK9TCUNHJFSEJMOPHZWOPSCHQWWB',
    'EIVXCFL9UFLMVFDNUHFWDEWGWFKSK9JJIAUFINOCDZGVTTACCXBCJUWUNMNLMSOFMCH9YLWNTYAXB9HAZONJOUXQKX',
  ],
  nem: [
    'NDEVPOSK4OMR4PRTLYFHX4W5QTOND7TZDT2DTU4Q',
    'NCOSIGIMCITYNRE7XUR77OREOYFLPAILCNUYLTPD',
    'nas2ei-hlfeto-nk6mxv-o7aqjx-aze2f4-m47jv3-spqd'
  ],
  dash: [
    'XcKvX5SeAwPSfyiKBw6QKt6EnA9FtWvk1r',
    'Xmkz13raTXeGewW5FVUZU388NBNUiBGeLM',
    'XfcLDYdv97tc8YYbQqmR1gxBdLq4xfPNdy'
  ],
  lisk: [
    '12857752866630342784L',
    '4980451641598555896L',
    '18278674964748191682L',
  ],
  ardor: [
    'ARDOR-48NJ-76V4-467V-EVWLV',
    'ARDOR-89FS-VS56-S2AM-6RHR8',
    'ARDOR-Z35Q-Z9N4-NFGR-FD9ZM'
  ],
  ark: [
    'AHZU2QizGuZMibcEQAvqQKcyYJU8t63kGf',
    'AFrPtEmzu6wdVpa2CnRDEKGQQMWgq8nE9V',
    'AURAgRqA5fazR2o9HA6FN7SitYjW4uxyns'
  ],
  decred: [
    'Dsft8jTzLpre1xJess45CqCfJAEctdYnDz2',
    'DsTtLNjR9GTNhj7GsEK4fUeTSXnssGUX6ms'
  ],
  dogecoin: [
    'DN1nxNhYcsux2LC8P91mftTFtAfYRoCMcb',
    'DMtWzPzwdU7oBThQKDCoXNwBcuoevoqtfM',
    'DCbuur8VsBUpYzvo9LTzFDHmn6U5T7BGQZ'
  ],
  pivx: [
    'DC3cikgoRuawpTbVn4kuMaBZrQA4cKysGV',
    'DFyNeuZH1z3Dp94F642C58f58MwWf93hL8',
    'D7kwcSf2gMsc4WdbxjooZ1kYwHofeKwHRc'
  ],
  qtum: [
    'MVv4EJgCZGCk1mUk3gcNFV3kMrbofbDQLY',
    'QUMjbkZ8NtBrPnEcBD67oYvnyqQjHdARcg',
    'QTz7PyCea2T8VZJQFv4z6o1pSvD3GdX371'
  ],
  sia: [
    '1bec860ef35d5344bd42976f7e232a0613e06bd0a7aa95061a19f8751296529a107f2dc09467',
  ],
  steem: [
    'ned',
    'brandonfrye',
    'adamkokesh'
  ],
  waves: [
    '3P2HNUd5VUPLMQkJmctTPEeeHumiPN2GkTb',
    '3PDL8x4gw9LkwKuW793zpqKMgHtJmGnBTsk'
  ],
  stratis: [
    'SQXV89VgTyW7FGZEVB3qDT7NGegpJ41p5k',
    'SdUfPafuFNu96KV9TyWWpXDiEVXUvzHZQj',
    'SY6eQZRB8ohmxf8Ci8QoCiYqqCqYbjypUr'
  ],
  verge: [
    'D6oMT8y13XiospytDbLVn7cT4C4AM9LsyH',
    'DTPa34xMMd9REFBrEBv9y9Dh6R3xi859Gb'
  ],
  zcoin: [
    'a38MBoAmm3VoDaJuoqFikreXsqdxAT4WKV',
    'aHzPtpTSCQDWJPwr3u9d1xZqh5rqq4Lubd',
    'aDy2ABY7sAVYXRkDSXMRFW5ekwvmcz8U4S'
  ],
  zcash: [
    't1aZ2DGuiokCxHVfb4cGQqXghxy9hUpE6xQ',
    't1aqVBduvg4PVB74c7on1a46mDkURAFKUKs',
    't1f6RcZPQCwz1v956B3FGn1TisH7nhMGmEw'
  ],
  digibyte: [
    'D6V1T4PyanZgJaF5PDLupSAKo3EiQkscum',
    'D7JGeYwVqN2DNnX7cLoqawJvZJetyzccnc',
    'DBF4pdn7CGZMkxFUvdMbfxyJ8cRqfwsurj'
  ],
  nano: [
    'xrb_1p7bzkugi4aj77k6zwe8kcofkuq6xp3pzry5ftn6y1htymcwm1qscon5khjn',
    'xrb_3znyn9ezgqcewdpibso1kko1gabauc9rgntcdop95q6qd8rsekx9wn4ipe83',
    'xrb_1p7bzkugi4aj77k6zwe8kcofkuq6xp3pzry5ftn6y1htymcwm1qscon5khjn'
  ],
  nxt: [
    'NXT-KX2C-5PWG-ZCB2-A4T8B',
    'NXT-LVKY-Q9KY-5Q2Z-AV9JA',
    'NXT-7P3L-4CLT-M4F6-48AQ5'
  ],
  byteball: [
    'OYW2XTDKSNKGSEZ27LMGNOPJSYIXHBHC',
    'VCATFTIYXVZETBW35DSEIZXWD3WMQ6DR',
    'BCSM665TUHAGP5YVMCIZX6A6MSEMVJ44'
  ]

};

export default testAddresses;
