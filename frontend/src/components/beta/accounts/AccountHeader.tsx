import * as React from "react";

import JSBI from "jsbi";
import { Trans, useTranslation } from "next-i18next";

import { Account } from "@/common/types/procedures";
import {
  AccountContract,
  SmallHeader,
} from "@/frontend/components/beta/accounts/AccountContract";
import { StringConditionalOverlay } from "@/frontend/components/beta/common/StringConditionalOverlay";
import { CopyToClipboard } from "@/frontend/components/utils/CopyToClipboard";
import { Link } from "@/frontend/components/utils/Link";
import { NearAmount } from "@/frontend/components/utils/NearAmount";
import { Timer } from "@/frontend/components/utils/Timer";
import * as BI from "@/frontend/libraries/bigint";
import {
  BasicDecimalPower,
  BASIC_DENOMINATION,
  formatBytes,
  formatToPowerOfTen,
  shortenString,
} from "@/frontend/libraries/formatting";
import { styled } from "@/frontend/libraries/styles";

type Props = {
  account: Account;
};

const Wrapper = styled("div", {
  padding: 28,
  borderRadius: 8,
  backgroundColor: "#000",
  color: "#fff",
});

const HorizontalBlock = styled("div", {
  display: "flex",
  justifyContent: "space-between",

  "& + &": {
    marginTop: 32,
  },

  "@media (max-width: 1000px)": {
    flexDirection: "column",
  },

  "&:empty": {
    display: "none",
  },
});

const BaseInfo = styled("div", {
  display: "flex",
  marginRight: 48,

  "@media (max-width: 1000px)": {
    marginRight: 0,
    marginBottom: 48,
  },
});

const AccountId = styled("h1", {
  fontSize: 36,
  fontWeight: 700,
  fontFamily: "Manrope",
  color: "#ffffff",
});

const AccountCopy = styled("span", {
  marginLeft: 16,
});

const BaseInfoDetails = styled("div", {
  display: "flex",
  alignItems: "center",
  marginTop: 8,
});

const InfoLineGap = styled("div", {
  marginLeft: 32,
});

const InfoLine = styled("span", {
  color: "#c9c9c9",
  fontSize: 12,
});

const CreatedBy = styled(Link, {
  color: "#c9c9c9",
  fontSize: 12,
  textDecoration: "underline",
  "&:hover": {
    color: "#c9c9c9",
    textDecoration: "underline",
  },
});

const NumericDivider = styled("div", {
  marginHorizontal: 16,
});

const AccountTypeBadge = styled("div", {
  textTransform: "uppercase",
  fontSize: 10,
  fontWeight: 700,
  fontFamily: "Manrope",
  borderRadius: 4,
  padding: "4px 12px",

  variants: {
    type: {
      user: {
        backgroundColor: "#7578FB",
        color: "#ffffff",
      },
      contract: {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        color: "#ffffff",
      },
    },
  },
});

const NumericInfo = styled("div", {
  display: "flex",
  alignItems: "center",
});

const Quantity = styled("div", {
  fontWeight: 500,
  fontSize: 24,
  color: "#ffffff",
  marginTop: 16,
  whiteSpace: "nowrap",
});

export const AccountHeader: React.FC<Props> = React.memo((props) => {
  const { t } = useTranslation();
  const transactionsQuantity =
    props.account.transactionsQuantity === undefined
      ? undefined
      : formatToPowerOfTen<BasicDecimalPower>(
          props.account.transactionsQuantity.toString(),
          6
        );
  return (
    <Wrapper>
      <HorizontalBlock>
        <BaseInfo>
          <div>
            <StringConditionalOverlay
              tooltipId="accountId"
              value={props.account.id}
            >
              <AccountId>
                {shortenString(props.account.id)}
                <AccountCopy>
                  <CopyToClipboard text={props.account.id} />
                </AccountCopy>
              </AccountId>
            </StringConditionalOverlay>
            <BaseInfoDetails>
              <CreatedBy
                href={
                  props.account.created
                    ? `/transactions/${props.account.created.hash}`
                    : undefined
                }
              >
                {props.account.created ? (
                  <Trans
                    i18nKey="pages.account.header.createdAt"
                    t={t}
                    components={{
                      Timer: <Timer time={props.account.created.timestamp} />,
                    }}
                  />
                ) : (
                  t("common.terms.genesis")
                )}
              </CreatedBy>
              <InfoLineGap />
              <InfoLine>
                {t("pages.account.header.storageUsed", {
                  amount: formatBytes(props.account.storageUsed),
                })}
              </InfoLine>
              <InfoLineGap />
              <AccountTypeBadge
                type={props.account.isContract ? "contract" : "user"}
              >
                {props.account.isContract
                  ? t("pages.account.header.accountType.contract")
                  : t("pages.account.header.accountType.user")}
              </AccountTypeBadge>
            </BaseInfoDetails>
          </div>
        </BaseInfo>
        <NumericInfo>
          <div>
            <SmallHeader>
              {t("pages.account.header.amounts.balance")}
            </SmallHeader>
            <Quantity>
              <NearAmount
                amount={props.account.nonStakedBalance}
                decimalPlaces={2}
              />
            </Quantity>
          </div>
          <NumericDivider />
          {!JSBI.equal(JSBI.BigInt(props.account.stakedBalance), BI.zero) ? (
            <>
              <div>
                <SmallHeader>
                  {t("pages.account.header.amounts.staked")}
                </SmallHeader>
                <Quantity>
                  <NearAmount
                    amount={props.account.stakedBalance}
                    decimalPlaces={2}
                  />
                </Quantity>
              </div>
              <NumericDivider />
            </>
          ) : null}
          <div>
            <SmallHeader>
              {t("pages.account.header.amounts.transactions")}
            </SmallHeader>
            {transactionsQuantity ? (
              <Quantity>{`${transactionsQuantity.quotient}${
                BASIC_DENOMINATION[transactionsQuantity.prefix]
              }`}</Quantity>
            ) : null}
          </div>
        </NumericInfo>
      </HorizontalBlock>
      <HorizontalBlock>
        <AccountContract id={props.account.id} />
      </HorizontalBlock>
    </Wrapper>
  );
});
