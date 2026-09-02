import CSS from "csstype"
import React from "react"

import { AdditionalInfo } from "src/components/AdditionalInfo"
import { InfoTitle } from "src/components/InfoTitle"
import { BadgeColorsEnum, badgeColorsObj } from "src/constants/index"

import classes from "./BadgeTitle.module.scss"

type PropsBase = {
  title: string
  additionalInfo?: string
  color?: BadgeColorsEnum
  // Render the title as a real heading (h1-h3) instead of a plain span, so screen
  // readers get page structure. Styling is unchanged; only the tag changes.
  headingLevel?: 1 | 2 | 3
  className?: string
  style?: CSS.Properties
}

type Props = PropsBase & ({ isInfo?: true; desc: string } | { isInfo?: false; desc?: string })

const BadgeTitle: React.FC<Props> = ({
  title,
  additionalInfo,
  color = BadgeColorsEnum.Main,
  headingLevel,
  isInfo,
  desc,
  className,
  style,
}) => {
  const classNames = [classes.badgeContainer, className].join(" ")
  const TitleTag = (headingLevel ? `h${headingLevel}` : "span") as keyof JSX.IntrinsicElements

  return (
    <div className={classNames} style={style}>
      <div className={classes.badge} style={{ backgroundColor: badgeColorsObj[color] }}></div>
      {isInfo ? (
        <InfoTitle
          title={title}
          desc={desc}
          style={{ fontWeight: 600, fontSize: "20px", marginBottom: 0 }}
        />
      ) : (
        <TitleTag className={classes.title}>{title}</TitleTag>
      )}
      {additionalInfo && (
        <AdditionalInfo info={additionalInfo} color={color} style={{ marginLeft: "3.2rem" }} />
      )}
    </div>
  )
}

export default BadgeTitle
