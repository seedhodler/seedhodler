import React, { useContext } from "react"
import parse from "html-react-parser"

import { Button } from "src/components/Button"
import { Modal } from "src/components/Modal"
import { BadgeColorsEnum, helpChapters, type HelpBlock } from "src/constants/"

import { HelpModalContext } from "src/context/HelpModalContext"
import classes from "./HelpModal.module.scss"

const renderBlock = (block: HelpBlock, index: number) => {
  switch (block.type) {
    case "h":
      return (
        <p key={index} className={classes.subhead}>
          {parse(block.html)}
        </p>
      )
    case "ul":
      return (
        <ul key={index} className={classes.list}>
          {block.items.map((item, i) => (
            <li key={i}>{parse(item)}</li>
          ))}
        </ul>
      )
    case "ol":
      return (
        <ol key={index} className={classes.olist}>
          {block.items.map((item, i) => (
            <li key={i}>{parse(item)}</li>
          ))}
        </ol>
      )
    default:
      return (
        <p key={index} className={classes.para}>
          {parse(block.html)}
        </p>
      )
  }
}

const HelpModal: React.FC = () => {
  const { isOpen, setIsOpen, tab, setTab } = useContext(HelpModalContext)

  const handleClose = () => {
    setIsOpen(false)
    setTab(helpChapters[0].id)
  }

  const active = helpChapters.find(chapter => chapter.id === tab) ?? helpChapters[0]

  return (
    <Modal
      badgeColor={BadgeColorsEnum.Success}
      title="Help & getting started"
      isActive={isOpen}
      setIsActive={v => setIsOpen(v)}
      style={{ height: "auto" }}
    >
      <div className={classes.container}>
        <div className={classes.divider}></div>

        <div className={classes.layout}>
          <nav className={classes.nav} aria-label="Help sections">
            {helpChapters.map(chapter => (
              <button
                key={chapter.id}
                type="button"
                className={`${classes.navItem} ${chapter.id === active.id ? classes.navItemActive : ""}`}
                aria-current={chapter.id === active.id || undefined}
                onClick={() => setTab(chapter.id)}
              >
                {chapter.nav}
              </button>
            ))}
          </nav>

          <div className={classes.content}>
            <p className={classes.contentTitle}>{active.title}</p>
            <div className={classes.contentBody}>{active.blocks.map(renderBlock)}</div>
          </div>
        </div>

        <p className={classes.footer}>
          Free and open source.{" "}
          <a
            href="https://github.com/seedhodler/seedhodler"
            target="_blank"
            rel="noopener noreferrer"
            className={classes.link}
          >
            View the code on GitHub
          </a>
          . Provided as is, with no warranty; you are responsible for your own keys and backups.
        </p>

        <div className={classes.buttonContainer}>
          <Button onClick={handleClose}>Got it</Button>
        </div>
      </div>
    </Modal>
  )
}

export default HelpModal
