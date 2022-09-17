import React, { FC, useMemo } from 'react'
import { erc20ABI, useBalance as useWagmiBalance, useContractReads } from 'wagmi'

const validatedTokenAddresses = [
  ['0x155f0DD04424939368972f4e1838687d6a831151'],
  ['0x0e15258734300290a651FdBAe8dEb039a8E7a2FA'],
  ['0x1a7BD9EDC36Fb2b3c0852bcD7438c2A957Fd7Ad5'],
  ['0x9f20de1fc9b161b34089cbEAE888168B44b03461'],
  ['0x09ad12552ec45f82bE90B38dFE7b06332A680864'],
  ['0x86A1012d437BBFf84fbDF62569D12d4FD3396F8c'],
  ['0xA6219B4Bf4B861A2b1C02da43b2aF266186eDC04'],
  ['0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8'],
  ['0x99C409E5f62E4bd2AC142f17caFb6810B8F0BAAE'],
  ['0xAFD871f684F21Ab9D7137608C71808f83D75e6fc'],
  ['0x031d35296154279DC1984dCD93E392b1f946737b'],
  ['0x3a8B787f78D775AECFEEa15706D4221B40F345AB'],
  ['0x354A6dA3fcde098F8389cad84b0182725c6C91dE'],
  ['0xf4D48Ce3ee1Ac3651998971541bAdbb9A14D7234'],
  ['0xc136E6B376a9946B156db1ED3A34b08AFdAeD76d'],
  ['0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978'],
  ['0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'],
  ['0x69Eb4FA4a2fbd498C257C57Ea8b7655a2559A581'],
  ['0x4425742F1EC8D98779690b5A3A6276Db85Ddc01A'],
  ['0x6C2C06790b3E3E3c38e12Ee22F8183b37a13EE55'],
  ['0xF0B5cEeFc89684889e5F7e0A7775Bd100FcD3709'],
  ['0xA7Aa2921618e3D63dA433829d448b58C9445A4c3'],
  ['0xC3Ae0333F0F34aa734D5493276223d95B8F9Cb37'],
  ['0x123389C2f0e9194d9bA98c21E63c375B67614108'],
  ['0x969131D8ddC06C2Be11a13e6E7fACF22CF57d95e'],
  ['0x876Ec6bE52486Eeec06bc06434f3E629D695c6bA'],
  ['0x2338a5d62E9A766289934e8d2e83a443e8065b83'],
  ['0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F'],
  ['0xBDeF0E9ef12E689F366fe494A7A7D0dad25D9286'],
  ['0x9d2F299715D94d8A7E6F5eaa8E654E8c74a988A7'],
  ['0x590020B1005b8b25f1a2C82c5f743c540dcfa24d'],
  ['0xa0b862F60edEf4452F25B4160F177db44DeB6Cf1'],
  ['0x8D9bA570D6cb60C7e3e0F31343Efe75AB8E65FB1'],
  ['0x23A941036Ae778Ac51Ab04CEa08Ed6e2FE103614'],
  ['0x10010078a54396F62c96dF8532dc2B4847d47ED3'],
  ['0xCB58418Aa51Ba525aEF0FE474109C0354d844b7c'],
  ['0xB41bd4C99dA73510d9e081C5FADBE7A27Ac1F814'],
  ['0xF018865b26fFAb9cd1735DCca549D95b0CB9Ea19'],
  ['0x662d0f9Ff837A51cF89A1FE7E0882a906dAC08a3'],
  ['0x5375616bB6c52A90439fF96882a986d8FCdCe421'],
  ['0x10393c20975cF177a3513071bC110f7962CD67da'],
  ['0x1f6Fa7A58701b3773b08a1a16D06b656B0eCcb23'],
  ['0xf97f4df75117a78c1A5a0DBb814Af92458539FB4'],
  ['0x539bdE0d7Dbd336b79148AA742883198BBF60342'],
  ['0x8eD4191F81F1e1D24a8a1195267D024d9358c9d7'],
  ['0x99F40b01BA9C469193B360f72740E416B17Ac332'],
  ['0x4e352cF164E64ADCBad318C3a1e222E9EBa4Ce42'],
  ['0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A'],
  ['0x2e9a6Df78E42a30712c10a9Dc4b1C8656f8F2879'],
  ['0xeD3fB761414DA74b74F33e5c5a1f78104b188DfC'],
  ['0xEe9801669C6138E84bD50dEB500827b776777d28'],
  ['0x369eB8197062093a20402935D3a707b4aE414E9D'],
  ['0x3642c0680329ae3e103E2B5AB29DDfed4d43CBE5'],
  ['0x51318B7D00db7ACc4026C88c3952B66278B6A67F'],
  ['0xF236ea74B515eF96a9898F5a4ed4Aa591f253Ce1'],
  ['0xe7f6C3c1F0018E4C08aCC52965e5cbfF99e34A44'],
  ['0x78055dAA07035Aa5EBC3e5139C281Ce6312E1b22'],
  ['0x51fC0f6660482Ea73330E414eFd7808811a57Fa2'],
  ['0x0C4681e6C0235179ec3D4F4fc4DF3d14FDD96017'],
  ['0x32Eb7902D4134bf98A28b963D26de779AF92A212'],
  ['0xef888bcA6AB6B1d26dbeC977C455388ecd794794'],
  ['0x7bA4a00d54A07461D9DB2aEF539e91409943AdC9'],
  ['0x3E6648C5a70A150A88bCE65F4aD4d506Fe15d2AF'],
  ['0xF7428FFCb2581A2804998eFbB036A43255c8A8D3'],
  ['0x6694340fc020c5E6B96567843da2df01b2CE1eb6'],
  ['0x326c33FD1113c1F29B35B4407F3d6312a8518431'],
  ['0xA970AF1a584579B618be4d69aD6F73459D112F95'],
  ['0xd4d42F0b6DEF4CE0383636770eF773390d85c61A'],
  ['0x955b9fe60a5b5093df9Dc4B1B18ec8e934e77162'],
  ['0xA72159FC390f0E3C6D415e658264c7c4051E9b87'],
  ['0x1622bF67e6e5747b81866fE0b85178a93C7F86e3'],
  ['0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0'],
  ['0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'],
  ['0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'],
  ['0x641441c631e2F909700d2f41FD87F0aA6A6b4EDb'],
  ['0x995C235521820f2637303Ca1970c7c044583df44'],
  ['0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f'],
  ['0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'],
  ['0xcAFcD85D8ca7Ad1e1C6F82F651fA15E33AEfD07b'],
  ['0x739ca6D71365a08f584c8FC4e1029045Fa8ABC4B'],
  ['0x82e3A8F066a6989666b031d916c43672085b1582'],
  ['0xdb96f8efd6865644993505318cc08FF9C42fb9aC'],
]

export const useBalances = ({ enabled = true, chainId, account }) => {
  useWagmiBalance({
    addressOrName: account,
    chainId,
    enabled,
    watch: true,
    keepPreviousData: true,
  })

  const contracts = useMemo(() => {
    const input = validatedTokenAddresses.map((token) => {
      return {
        chainId,
        addressOrName: token[0],
        contractInterface: erc20ABI,
        functionName: 'balanceOf',
        args: [account],
      }
    })

    return input
  }, [chainId, account])

  const { data } = useContractReads({
    contracts: contracts,
    enabled,
    watch: !(typeof enabled !== undefined && !enabled),
    keepPreviousData: true,
  })

  return data
}

const Index: FC = () => {
  const data = useBalances({
    enabled: true,
    chainId: 42161,
    account: '0x7a5f66Eb194F629dB12F25bd0695819CB690fcc7',
  })

  return <div>{JSON.stringify(data)}</div>

  // const { chain } = useNetwork()
  // const chainId = chain?.id || ChainId.ETHEREUM
  // const [input0, setInput0] = useState<string>('')
  // const [token0, setToken0] = useState<Type | undefined>()
  // const [input1, setInput1] = useState<string>('')
  // const [token1, setToken1] = useState<Type | undefined>()
  // const [tradeType, setTradeType] = useState<TradeType>(TradeType.EXACT_INPUT)
  //
  // const [customTokensMap, { addCustomToken, removeCustomToken }] = useCustomTokens(chainId)
  // const tokenMap = useTokens(chainId)
  //
  // const [parsedInput0, parsedInput1] = useMemo(() => {
  //   return [tryParseAmount(input0, token0), tryParseAmount(input1, token1)]
  // }, [input0, input1, token0, token1])
  //
  // const onInput0 = useCallback((val: string) => {
  //   setTradeType(TradeType.EXACT_INPUT)
  //   setInput0(val)
  // }, [])
  //
  // const onInput1 = useCallback((val: string) => {
  //   setTradeType(TradeType.EXACT_OUTPUT)
  //   setInput1(val)
  // }, [])
  //
  // const switchCurrencies = useCallback(() => {
  //   const srcToken = token0
  //   const dstToken = token1
  //
  //   setToken0(srcToken)
  //   setToken1(dstToken)
  // }, [token0, token1])
  //
  // const amounts = useMemo(() => [parsedInput0], [parsedInput0])

  return (
    <>
      {/*<TradeProvider*/}
      {/*  chainId={chainId}*/}
      {/*  tradeType={tradeType}*/}
      {/*  amountSpecified={tradeType === TradeType.EXACT_INPUT ? parsedInput0 : parsedInput1}*/}
      {/*  mainCurrency={token0}*/}
      {/*  otherCurrency={token1}*/}
      {/*>*/}
      {/*  <Layout>*/}
      {/*    <Widget id="swap" maxWidth={400}>*/}
      {/*      <Widget.Content>*/}
      {/*        <Widget.Header title="Swap">*/}
      {/*          <SettingsOverlay chainId={chainId} />*/}
      {/*        </Widget.Header>*/}
      {/*        <CurrencyInput*/}
      {/*          className="p-3"*/}
      {/*          value={input0}*/}
      {/*          onChange={onInput0}*/}
      {/*          currency={token0}*/}
      {/*          onSelect={setToken0}*/}
      {/*          customTokenMap={customTokensMap}*/}
      {/*          onAddToken={addCustomToken}*/}
      {/*          onRemoveToken={removeCustomToken}*/}
      {/*          chainId={chainId}*/}
      {/*          tokenMap={tokenMap}*/}
      {/*          inputType={TradeType.EXACT_INPUT}*/}
      {/*          tradeType={tradeType}*/}
      {/*        />*/}
      {/*        <div className="flex items-center justify-center -mt-[12px] -mb-[12px] z-10">*/}
      {/*          <button*/}
      {/*            type="button"*/}
      {/*            onClick={switchCurrencies}*/}
      {/*            className="group bg-slate-700 p-0.5 border-2 border-slate-800 transition-all rounded-full hover:ring-2 hover:ring-slate-500 cursor-pointer"*/}
      {/*          >*/}
      {/*            <div className="transition-all rotate-0 group-hover:rotate-180 group-hover:delay-200">*/}
      {/*              <ChevronDownIcon width={16} height={16} />*/}
      {/*            </div>*/}
      {/*          </button>*/}
      {/*        </div>*/}
      {/*        <div className="bg-slate-800">*/}
      {/*<CurrencyInput*/}
      {/*  className="p-3"*/}
      {/*  value={input1}*/}
      {/*  onChange={onInput1}*/}
      {/*  currency={token1}*/}
      {/*  onSelect={setToken1}*/}
      {/*  customTokenMap={customTokensMap}*/}
      {/*  onAddToken={addCustomToken}*/}
      {/*  onRemoveToken={removeCustomToken}*/}
      {/*  chainId={chainId}*/}
      {/*  tokenMap={tokenMap}*/}
      {/*  inputType={TradeType.EXACT_OUTPUT}*/}
      {/*  tradeType={tradeType}*/}
      {/*/>*/}
      {/*          <SwapStatsDisclosure />*/}
      {/*          <div className="p-3 pt-0">*/}
      {/*            <Checker.Amounts*/}
      {/*              fullWidth*/}
      {/*              size="md"*/}
      {/*              chainId={chainId}*/}
      {/*              fundSource={FundSource.WALLET}*/}
      {/*              amounts={amounts}*/}
      {/*            >*/}
      {/*              <Checker.Connected fullWidth size="md">*/}
      {/*                <Checker.Network fullWidth size="md" chainId={chainId}>*/}
      {/*                  <SwapReviewModalLegacy chainId={chainId}>*/}
      {/*                    {({ isWritePending, setOpen }) => {*/}
      {/*                      return (*/}
      {/*                        <Button fullWidth onClick={() => setOpen(true)} disabled={isWritePending} size="md">*/}
      {/*                          {isWritePending ? <Dots>Executing Swap</Dots> : 'Confirm Swap'}*/}
      {/*                        </Button>*/}
      {/*                      )*/}
      {/*                    }}*/}
      {/*                  </SwapReviewModalLegacy>*/}
      {/*                </Checker.Network>*/}
      {/*              </Checker.Connected>*/}
      {/*            </Checker.Amounts>*/}
      {/*          </div>*/}
      {/*        </div>*/}
      {/*      </Widget.Content>*/}
      {/*    </Widget>*/}
      {/*  </Layout>*/}
      {/*</TradeProvider>*/}
    </>
  )
}

export default Index
