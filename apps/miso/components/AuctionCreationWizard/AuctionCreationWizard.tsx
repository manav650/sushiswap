import { Button, Stepper } from '@sushiswap/ui'
import React, { FC, useState } from 'react'

import { AuctionDetailsStep } from './AuctionDetailsStep'
import { GeneralDetailsStep } from './GeneralDetailsStep'
import { LiquidityLauncherStep } from './LiquidityLauncherStep'
import ReviewDetailsStep from './ReviewDetailsStep'
import CreateAuctionButtons from './ReviewDetailsStep/CreateAuctionButtons'
import { TokenCreationStep } from './TokenCreationStep'
import WhitelistDetailsStep from './WhitelistDetailsStep'

export const AuctionCreationWizard: FC = () => {
  const [step, setStep] = useState<number>(0)

  return (
    <div>
      <Stepper.Vertical activeStep={step} setActiveStep={setStep}>
        <Stepper.Vertical.Step>
          <Stepper.Vertical.Label>Token Details*</Stepper.Vertical.Label>
          <Stepper.Vertical.Content
            description={
              <Stepper.Vertical.Description>
                If you already have an ERC-20 token, use “Provide Token.” If you’d like to create one now with MISO, use
                the “Create Token” tab.
              </Stepper.Vertical.Description>
            }
          >
            <TokenCreationStep>
              {(isValid) => (
                <div className="flex gap-4">
                  <Button
                    size="sm"
                    disabled={!isValid}
                    onClick={() => setStep((prevStep) => prevStep + 1)}
                    type="submit"
                  >
                    Continue
                  </Button>
                </div>
              )}
            </TokenCreationStep>
          </Stepper.Vertical.Content>
        </Stepper.Vertical.Step>
        <Stepper.Vertical.Step>
          <Stepper.Vertical.Label>General Details*</Stepper.Vertical.Label>
          <Stepper.Vertical.Content
            description={
              <Stepper.Vertical.Description>
                Please select the payment currency for your auction, and its start and end dates.
              </Stepper.Vertical.Description>
            }
          >
            <GeneralDetailsStep>
              {(isValid) => (
                <div className="flex gap-4">
                  <Button
                    size="sm"
                    disabled={!isValid}
                    onClick={() => setStep((prevStep) => prevStep + 1)}
                    type="submit"
                  >
                    Continue
                  </Button>
                  <Button size="sm" variant="empty" type="button" onClick={() => setStep((prevStep) => prevStep - 1)}>
                    Back
                  </Button>
                </div>
              )}
            </GeneralDetailsStep>
          </Stepper.Vertical.Content>
        </Stepper.Vertical.Step>
        <Stepper.Vertical.Step>
          <Stepper.Vertical.Label>Auction Details*</Stepper.Vertical.Label>
          <Stepper.Vertical.Content
            description={
              <Stepper.Vertical.Description>
                Please select an auction type, and set the price parameters for your auction.
              </Stepper.Vertical.Description>
            }
          >
            <AuctionDetailsStep>
              {(isValid) => (
                <div className="flex gap-4">
                  <Button
                    size="sm"
                    disabled={!isValid}
                    type="submit"
                    onClick={() => setStep((prevStep) => prevStep + 1)}
                  >
                    Continue
                  </Button>
                  <Button size="sm" variant="empty" type="button" onClick={() => setStep((prevStep) => prevStep - 1)}>
                    Back
                  </Button>
                </div>
              )}
            </AuctionDetailsStep>
          </Stepper.Vertical.Content>
        </Stepper.Vertical.Step>
        <Stepper.Vertical.Step>
          <Stepper.Vertical.Label>Liquidity</Stepper.Vertical.Label>
          <Stepper.Vertical.Content
            description={
              <Stepper.Vertical.Description>
                Optional - set aside tokens for creating a constant product pool on Sushi with your token and the
                auction currency token
              </Stepper.Vertical.Description>
            }
          >
            <LiquidityLauncherStep>
              {(isValid) => (
                <div className="flex gap-4">
                  <Button
                    size="sm"
                    disabled={!isValid}
                    onClick={() => setStep((prevStep) => prevStep + 1)}
                    type="submit"
                  >
                    Continue
                  </Button>
                  <Button size="sm" variant="empty" type="button" onClick={() => setStep((prevStep) => prevStep - 1)}>
                    Back
                  </Button>
                </div>
              )}
            </LiquidityLauncherStep>
          </Stepper.Vertical.Content>
        </Stepper.Vertical.Step>
        <Stepper.Vertical.Step>
          <Stepper.Vertical.Label>Whitelist</Stepper.Vertical.Label>
          <Stepper.Vertical.Content
            description={
              <Stepper.Vertical.Description>
                Optional - upload a CSV file with approved addresses to only allow participation by certain wallets
              </Stepper.Vertical.Description>
            }
          >
            <WhitelistDetailsStep>
              {(isValid) => (
                <div className="flex gap-4">
                  <Button
                    size="sm"
                    disabled={!isValid}
                    onClick={() => setStep((prevStep) => prevStep + 1)}
                    type="submit"
                  >
                    Continue
                  </Button>
                  <Button size="sm" variant="empty" type="button" onClick={() => setStep((prevStep) => prevStep - 1)}>
                    Back
                  </Button>
                </div>
              )}
            </WhitelistDetailsStep>
          </Stepper.Vertical.Content>
        </Stepper.Vertical.Step>
        <Stepper.Vertical.Step>
          <Stepper.Vertical.Label>Review</Stepper.Vertical.Label>
          <Stepper.Vertical.Content
            description={
              <Stepper.Vertical.Description>Please review your entered details thoroughly</Stepper.Vertical.Description>
            }
          >
            <ReviewDetailsStep>
              {(isValid) =>
                isValid ? (
                  <CreateAuctionButtons onBack={() => setStep((prevStep) => prevStep - 1)} />
                ) : (
                  <>
                    <Button size="sm" type="button" disabled={true}>
                      Approve
                    </Button>
                    <Button size="sm" type="button" disabled={true}>
                      Create auction
                    </Button>
                    <Button size="sm" variant="empty" type="button" onClick={() => setStep((prevStep) => prevStep - 1)}>
                      Back
                    </Button>
                  </>
                )
              }
            </ReviewDetailsStep>
          </Stepper.Vertical.Content>
        </Stepper.Vertical.Step>
      </Stepper.Vertical>
    </div>
  )
}
