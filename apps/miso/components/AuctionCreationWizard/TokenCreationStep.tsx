import { RadioGroup } from '@headlessui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { Token } from '@sushiswap/currency'
import { Form, Input, Select, Typography } from '@sushiswap/ui'
import { TokenSelector } from '@sushiswap/wagmi'
import { BlocksIcon, MintableTokenIcon, SushiTokenIcon } from 'app/components/Icon'
import useTokenTemplateMap from 'app/features/miso/context/hooks/useTokenTemplateMap'
import { useStore } from 'app/features/miso/context/store'
import { ITokenDetails, tokenDetailsDefaultValues } from 'app/features/miso/context/store/createTokenDetailsSlice'
import { TokenSetup, TokenType } from 'app/features/miso/context/types'
import { classNames } from 'app/functions'
import { addressValidator } from 'app/functions/yupValidators'
import React, { FC, ReactNode, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useAccount, useNetwork } from 'wagmi'
import * as yup from 'yup'

import { useCustomTokens } from '../../lib/state/storage'
import { useTokens } from '../../lib/state/token-lists'

export const tokenSchema = yup.object().shape({
  token: yup.mixed<Token>().currency().required('This field is required'),
  tokenSetupType: yup
    .number()
    .test({
      message: 'Please select an token setup type',
      test: (value) => value !== TokenSetup.NOT_SET,
    })
    .required('Must select a token setup type'),
  tokenAddress: yup.string().when('tokenSetupType', {
    is: (value: TokenSetup) => value === TokenSetup.PROVIDE,
    then: addressValidator.required('Please enter a valid ERC20-address'),
    otherwise: yup.string().nullable(),
  }),
  tokenType: yup.number().when('tokenSetupType', {
    is: (value: TokenSetup) => value === TokenSetup.CREATE,
    then: yup.number().required('Must select a token type'),
    otherwise: yup.number().nullable(),
  }),
  tokenName: yup.string().when('tokenSetupType', {
    is: (value: TokenSetup) => value === TokenSetup.CREATE,
    then: yup.string().required('Must enter a valid name'),
    otherwise: yup.string().nullable(),
  }),
  tokenSymbol: yup.string().when('tokenSetupType', {
    is: (value: TokenSetup) => value === TokenSetup.CREATE,
    then: yup.string().required('Must enter a valid symbol'),
    otherwise: yup.string().nullable(),
  }),
  tokenSupply: yup.number().when('tokenSetupType', {
    is: (value: TokenSetup) => value === TokenSetup.CREATE,
    then: yup
      .number()
      .typeError('Supply must be a number')
      .required('Must enter a valid number')
      .moreThan(0, 'Token supply must be larger than zero')
      .max(2e256 - 1, 'Token supply can be at most 2^256 - 1 due to network limitations')
      .integer('Must be a whole number')
      .test({
        message: 'Total supply must be more than twice the amount of tokens for sale',
        test: (value, ctx) => {
          if (!ctx.parent.tokenAmount) return true
          if (ctx.parent.tokenSetupType === TokenSetup.PROVIDE) return true
          return value ? value >= ctx.parent.tokenAmount * 2 : false
        },
      }),
    otherwise: yup.number().nullable(),
  }),
  tokenAmount: yup
    .number()
    .typeError('Must be a valid number')
    .required('Must enter a valid number')
    .moreThan(0, 'Token supply must be larger than zero')
    .integer('Must be a whole number')
    .test({
      message: 'Amount of tokens for sale must be less than half the total supply',
      test: (value, ctx) => {
        if (ctx.parent.tokenSetupType === TokenSetup.PROVIDE) return true
        return value ? value * 2 <= ctx.parent.tokenSupply : false
      },
    }),
})

export const TokenCreationStep: FC<{ children(isValid: boolean): ReactNode }> = ({ children }) => {
  const { i18n } = useLingui()
  const { templateIdToLabel } = useTokenTemplateMap()
  const { address } = useAccount()
  const { chain: activeChain } = useNetwork()
  const tokenMap = useTokens(activeChain?.id)
  const [customTokenMap, { addCustomToken, removeCustomToken }] = useCustomTokens(activeChain?.id)

  const [dialogOpen, setDialogOpen] = useState(false)

  const setTokenDetails = useStore((state) => state.setTokenDetails)
  const methods = useForm<ITokenDetails>({
    defaultValues: tokenDetailsDefaultValues,
    resolver: yupResolver(tokenSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  })

  const {
    watch,
    formState: { isValid },
    setValue,
    control,
  } = methods

  const [tokenType, tokenSetupType, token] = watch(['tokenType', 'tokenSetupType', 'token'])

  const tokenSetupItems = [
    {
      value: TokenSetup.PROVIDE,
      label: 'Provide token',
      description: i18n._(t`I already have an ERC20 token with 18 decimals`),
    },
    {
      value: TokenSetup.CREATE,
      label: 'Create token',
      description: i18n._(t`I want to create a new ERC20 token.`),
    },
  ]

  const items = [
    {
      icon: <BlocksIcon height={83} width={83} />,
      value: TokenType.FIXED,
      label: templateIdToLabel(TokenType.FIXED),
      description: i18n._(
        t`A "standard" ERC20 token with a fixed supply and protections against further token minting or burning.`
      ),
    },
    {
      icon: <MintableTokenIcon height={83} width={83} />,
      value: TokenType.MINTABLE,
      label: templateIdToLabel(TokenType.MINTABLE),
      description: i18n._(
        t`An ERC20 token with a function allowing further minting at a later date. Creators will have to assign an owner for the minting controls.`
      ),
    },
    {
      icon: <SushiTokenIcon height={83} width={83} />,
      value: TokenType.SUSHI,
      label: templateIdToLabel(TokenType.SUSHI),
      description: i18n._(
        t`Sushi tokens function similar to mintable tokens but with additional capabilities built into the token. Creators will have to assign an owner address for token functions during minting.`
      ),
    },
  ]

  return (
    <form {...methods} onSubmit={methods.handleSubmit((data: ITokenDetails) => setTokenDetails(data))}>
      <div>
        <div className="flex items-center col-span-6">
          <RadioGroup
            value={tokenSetupType || ''}
            onChange={(tokenSetupType) => setValue('tokenSetupType', Number(tokenSetupType), { shouldValidate: true })}
            className="flex gap-10"
          >
            <input className="hidden" name="tokenSetupType" value={tokenSetupType} onChange={() => {}} />
            <div className="flex flex-col w-full gap-0 border divide-y rounded md:flex-row md:gap-5 border-dark-800 md:divide-y-0 md:divide-x divide-dark-800">
              {tokenSetupItems.map<ReactNode>(({ description, label, value }, index) => (
                <RadioGroup.Option value={value} key={value}>
                  {({ checked }) => (
                    <div
                      className={classNames(
                        'flex flex-col border border-transparent gap-2 p-10 rounded h-full cursor-pointer max-w-[300px] hover:text-white',
                        index === 0 ? 'text-center md:text-right' : 'text-center md:text-left'
                      )}
                    >
                      <Typography variant="h3" className={checked ? 'text-purple' : 'text-inherit'}>
                        {label}
                      </Typography>
                      <Typography variant="sm" className={checked ? 'text-purple' : 'text-inherit'}>
                        {description}
                      </Typography>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
        {tokenSetupType === TokenSetup.CREATE && (
          <>
            <div className="col-span-6">
              <RadioGroup
                value={tokenType}
                onChange={(tokenType) => setValue('tokenType', tokenType, { shouldValidate: true })}
                className="grid grid-cols-1 gap-10 mt-2 lg:grid-cols-3 md:grid-cols-2"
              >
                <input className="hidden" name="tokenType" value={tokenType} onChange={() => {}} />
                {items.map(({ icon, value, label, description }) => (
                  <RadioGroup.Option value={value} key={value}>
                    {({ checked }) => (
                      <div
                        className={classNames(
                          checked ? 'bg-dark-1000/40 border-purple' : 'bg-dark-900 hover:border-purple/40',
                          'flex flex-col gap-4 border border-dark-800 p-5 rounded h-full cursor-pointer'
                        )}
                      >
                        <Typography variant="lg" weight={700} className="text-high-emphesis">
                          {label}
                        </Typography>
                        {icon}
                        <Typography className="text-high-emphesis">{description}</Typography>
                      </div>
                    )}
                  </RadioGroup.Option>
                ))}
              </RadioGroup>
            </div>
            <div className="w-full md:w-1/2">
              <Form.Control label="Name*">
                <Controller
                  control={control}
                  name="tokenName"
                  render={({ field: { onChange, value }, fieldState: { error } }) => {
                    return (
                      <>
                        <Input.DatetimeLocal
                          value={value}
                          onChange={onChange}
                          error={!!error?.message}
                          className="!ring-offset-slate-900"
                          placeholder="The name of your token"
                        />
                        <Form.HelperText
                          isError={Boolean(error?.message)}
                          message={
                            error?.message ||
                            'This will be the name of your token. Choose wisely, this is final and immutable.'
                          }
                        />
                      </>
                    )
                  }}
                />
              </Form.Control>
            </div>
            <div className="w-full md:w-1/2">
              <Form.Control label="Symbol*">
                <Controller
                  control={control}
                  name="tokenSymbol"
                  render={({ field: { onChange, value }, fieldState: { error } }) => {
                    return (
                      <>
                        <Input.DatetimeLocal
                          value={value}
                          onChange={onChange}
                          error={!!error?.message}
                          className="!ring-offset-slate-900"
                          placeholder="The symbol of your token"
                        />
                        <Form.HelperText
                          isError={Boolean(error?.message)}
                          message={
                            error?.message ||
                            'This will be the symbol of your token. Choose wisely, this is final and immutable.'
                          }
                        />
                      </>
                    )
                  }}
                />
              </Form.Control>
            </div>
            <div className="w-full md:w-1/2">
              <Form.Control label="Total Supply*">
                <Controller
                  control={control}
                  name="tokenSupply"
                  render={({ field: { onChange, value }, fieldState: { error } }) => {
                    return (
                      <>
                        <Input.DatetimeLocal
                          value={value}
                          onChange={onChange}
                          error={!!error?.message}
                          className="!ring-offset-slate-900"
                          placeholder="The total supply of your token"
                        />
                        <Form.HelperText
                          isError={Boolean(error?.message)}
                          message={
                            error?.message ||
                            (tokenType === TokenType.FIXED
                              ? 'This will be the initial supply of your token. Because your token type is set to fixed. This value will be final and immutable'
                              : 'This will be the initial supply of your token.')
                          }
                        />
                      </>
                    )
                  }}
                />
              </Form.Control>
            </div>
          </>
        )}
        {tokenSetupType === TokenSetup.PROVIDE && (
          <div className="w-full md:w-1/2">
            <Form.Control label="Token">
              <Controller
                control={control}
                name="currency"
                render={({ field: { onChange }, fieldState: { error } }) => {
                  return (
                    <>
                      <Select.Button
                        error={!!error?.message}
                        standalone
                        className="!cursor-pointer ring-offset-slate-900"
                        onClick={() => setDialogOpen(true)}
                      >
                        {token?.symbol || <span className="text-slate-500">Select a currency</span>}
                      </Select.Button>
                      <Form.Error message={error?.message} />
                      <TokenSelector
                        open={dialogOpen}
                        variant="dialog"
                        chainId={activeChain?.id}
                        tokenMap={tokenMap}
                        customTokenMap={customTokenMap}
                        onSelect={(currency) => {
                          onChange(currency.wrapped)
                          setDialogOpen(false)
                        }}
                        currency={token}
                        onClose={() => setDialogOpen(false)}
                        onAddToken={({ address, chainId, name, symbol, decimals }) =>
                          addCustomToken({ address, name, chainId, symbol, decimals })
                        }
                        onRemoveToken={removeCustomToken}
                      />
                    </>
                  )
                }}
              />
            </Form.Control>
          </div>
        )}
        {tokenSetupType !== undefined && (
          <div className="w-full md:w-1/2">
            <Form.Control label="Tokens for sale*">
              <Controller
                control={control}
                name="tokenAmount"
                render={({ field: { onChange, value }, fieldState: { error } }) => {
                  return (
                    <>
                      <Input.DatetimeLocal
                        value={value}
                        onChange={onChange}
                        error={!!error?.message}
                        className="!ring-offset-slate-900"
                        placeholder="Enter the amount of tokens you would like to auction."
                      />
                      <Form.HelperText
                        isError={Boolean(error?.message)}
                        message={error?.message || 'This is the amount of tokens that will be sold to the public'}
                      />
                    </>
                  )
                }}
              />
            </Form.Control>
          </div>
        )}
        {children(isValid)}
      </div>
    </form>
  )
}
