import React, { Dispatch, lazy, SetStateAction, Suspense } from "react"
import { Navigate, Route, Routes as RouterDomRoutes } from "react-router-dom"

import { Layout } from "src/components/Layout"
import { HomePage } from "src/pages/HomePage"
const PrintPage = lazy(() => import("src/pages/PrintPage"))

type Props = {
  isOnline: boolean
  showWarning: boolean
  setShowWarning: Dispatch<SetStateAction<boolean>>
}

const Routes: React.FC<Props> = ({
  isOnline,
  showWarning,
  setShowWarning,
}) => {
  return (
    <RouterDomRoutes>
      <Route
        path="/"
        element={
          <Layout
            isOnline={isOnline}
            showWarning={showWarning}
            setShowWarning={setShowWarning}
          />
        }
      >
        <Route index element={<HomePage />} />
        <Route path="print" element={<Suspense><PrintPage /></Suspense>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </RouterDomRoutes>
  )
}

export default Routes
