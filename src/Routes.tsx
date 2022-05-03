import React from "react"
import { Navigate, Route, Routes as RouterDomRoutes } from "react-router-dom"

import { Layout } from "components/Layout"
import { HomePage } from "pages/HomePage"

type Props = {
  isOnline: boolean
}

const Routes: React.FC<Props> = ({ isOnline }) => {
  return (
    <RouterDomRoutes>
      <Route path="/" element={<Layout isOnline={isOnline} />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </RouterDomRoutes>
  )
}

export default Routes
