import React, { Dispatch, SetStateAction } from "react"
import { Navigate, Route, Routes as RouterDomRoutes } from "react-router-dom"

import { Layout } from "components/Layout"
import { HomePage } from "pages/HomePage"
import { PrintPage } from "pages/PrintPage"

type Props = {
  isOnline: boolean
  setIsHelpModalActive: Dispatch<SetStateAction<boolean>>
}

const Routes: React.FC<Props> = ({ isOnline, setIsHelpModalActive }) => {
  return (
    <RouterDomRoutes>
      <Route
        path="/"
        element={<Layout isOnline={isOnline} setIsHelpModalActive={setIsHelpModalActive} />}
      >
        <Route index element={<HomePage />} />
        <Route path="print" element={<PrintPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </RouterDomRoutes>
  )
}

export default Routes
