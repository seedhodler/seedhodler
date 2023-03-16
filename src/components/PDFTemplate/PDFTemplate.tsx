import React from "react"
import { Document, Page, Text, View, Svg, Path } from "@react-pdf/renderer"

type Props = {
  selectedWordCount: number
  mnemonic: string[]
  shares: string[]
}

const PDFTemplate: React.FC<Props> = ({ selectedWordCount, mnemonic, shares }) => {
  return (
    <Document>
      <Page
        size="A4"
        key="0"
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <View
          style={{
            padding: "25px 40px",
            margin: "6px 10px",
            paddingBottom: "24px",
            border: "2px dashed #2d3748",
            borderRadius: "10px",
          }}
        >
          <View
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "28px",
              flexDirection: "row",
            }}
          >
            <View style={{ width: "60px" }}></View>
            <Svg
              width="289"
              height="55"
              viewBox="0 0 289 55"
              style={{ width: "200px", margin: "0 auto" }}
            >
              <Path
                d="M19.9114 36.5944C20.5743 36.4926 21.2261 36.3291 21.8584 36.106C22.659 35.8735 23.4329 35.5579 24.1674 35.1644L24.3352 35.0852H24.3705C27.5404 33.3252 29.973 30.144 30.3306 26.5228C30.7721 21.85 30.5337 17.1024 30.5823 12.39C30.5823 12.324 30.4895 12.258 30.3483 12.0732C23.9908 12.5968 20.0615 16.0332 18.3 22.1932C18.3 22.1052 18.3 22.2724 18.3 22.1932V24.468V28.7976C18.3 31.3936 18.3 33.9852 18.3 36.5768C18.2967 37.0977 18.3425 37.6177 18.4368 38.13C18.786 39.9888 19.7801 41.6659 21.2451 42.8677C22.71 44.0695 24.5525 44.7194 26.4499 44.7036C28.9929 44.7036 31.5315 44.7036 34.07 44.7036H34.5115V36.5944H19.9114Z"
                fill="black"
              />
              <Path d="M0 54.7893H34.4937V46.7373H0V54.7893Z" fill="black" />
              <Path
                d="M8.23382 44.6995C9.9626 44.6842 11.6406 44.1152 13.02 43.0765C14.3993 42.0377 15.4068 40.5844 15.8937 38.9311C16.0818 38.1724 16.2292 37.4042 16.3352 36.6299H0V44.6775C0.145692 44.6775 0.264895 44.7039 0.384098 44.7039C3.00214 44.7039 5.62019 44.7215 8.23382 44.6995Z"
                fill="black"
              />
              <Path
                d="M5.10355 17.1204C7.20063 21.8152 11.0372 24.1296 16.2733 24.4948V24.53V21.9956C16.1894 18.612 16.1673 15.2724 16.1938 11.9328C16.233 9.3845 15.3947 6.89979 13.8186 4.8928C11.3948 1.7336 8.20282 0 4.07929 0C4.01201 0.279176 3.96626 0.56307 3.94242 0.8492C3.94242 4.6244 3.82764 8.404 3.98657 12.1704C4.05182 13.8746 4.43042 15.5524 5.10355 17.1204Z"
                fill="#78BB58"
              />
              <Path
                d="M60.004 44.546C65.506 44.546 68.908 41.648 68.908 37.49C68.908 28.166 55.888 32.702 55.888 27.83C55.888 26.192 57.442 25.016 59.92 25.016C62.566 25.016 63.994 26.234 64.246 28.082H68.278C67.942 23.882 64.498 21.488 60.088 21.488C55.048 21.488 51.772 24.218 51.772 27.914C51.772 36.86 64.624 32.324 64.624 37.7C64.624 39.632 63.028 40.934 60.13 40.934C57.274 40.934 55.636 39.758 55.342 37.49H51.184C51.478 41.732 54.418 44.546 60.004 44.546ZM83.4515 44.546C88.8695 44.546 92.7755 41.606 93.9095 37.364H89.6255C88.7435 39.506 86.3495 40.85 83.5775 40.85C79.5455 40.85 76.9835 38.246 76.8155 34.424H94.1195V32.786C94.1195 26.528 90.2135 21.488 83.3675 21.488C77.1095 21.488 72.4055 26.108 72.4055 33.08C72.4055 39.674 76.8575 44.546 83.4515 44.546ZM76.8995 31.022C77.2355 27.578 80.0075 25.184 83.3675 25.184C86.7695 25.184 89.4575 27.326 89.7515 31.022H76.8995ZM108.207 44.546C113.625 44.546 117.531 41.606 118.665 37.364H114.381C113.499 39.506 111.105 40.85 108.333 40.85C104.301 40.85 101.739 38.246 101.571 34.424H118.875V32.786C118.875 26.528 114.969 21.488 108.123 21.488C101.865 21.488 97.1612 26.108 97.1612 33.08C97.1612 39.674 101.613 44.546 108.207 44.546ZM101.655 31.022C101.991 27.578 104.763 25.184 108.123 25.184C111.525 25.184 114.213 27.326 114.507 31.022H101.655ZM132.585 44.546C136.953 44.546 139.095 41.732 139.683 40.892H139.935V44H144.261V12.5H139.851V25.226H139.557C138.843 24.092 136.575 21.488 132.375 21.488C126.243 21.488 121.917 26.276 121.917 33.08C121.917 39.884 126.285 44.546 132.585 44.546ZM133.215 40.556C129.183 40.556 126.411 37.616 126.411 33.038C126.411 28.628 129.183 25.52 133.173 25.52C137.037 25.52 139.977 28.292 139.977 33.038C139.977 37.196 137.415 40.556 133.215 40.556ZM149.867 44H154.277V30.98C154.277 27.872 156.713 25.604 159.695 25.604C162.467 25.604 164.693 27.662 164.693 30.728V44H169.103V29.888C169.103 25.142 165.995 21.488 160.997 21.488C157.721 21.488 155.453 23.168 154.529 24.974H154.235V12.5H149.867V44ZM184.743 44.546C191.463 44.546 196.335 39.59 196.335 33.038C196.335 26.486 191.547 21.488 184.785 21.488C178.023 21.488 173.151 26.444 173.151 33.038C173.151 39.632 177.981 44.546 184.743 44.546ZM184.743 40.556C180.627 40.556 177.645 37.406 177.645 33.038C177.645 28.712 180.585 25.52 184.743 25.52C188.901 25.52 191.841 28.67 191.841 33.038C191.841 37.364 188.901 40.556 184.743 40.556ZM210.01 44.546C214.378 44.546 216.52 41.732 217.108 40.892H217.36V44H221.686V12.5H217.276V25.226H216.982C216.268 24.092 214 21.488 209.8 21.488C203.668 21.488 199.342 26.276 199.342 33.08C199.342 39.884 203.71 44.546 210.01 44.546ZM210.64 40.556C206.608 40.556 203.836 37.616 203.836 33.038C203.836 28.628 206.608 25.52 210.598 25.52C214.462 25.52 217.402 28.292 217.402 33.038C217.402 37.196 214.84 40.556 210.64 40.556ZM232.501 44H234.307V40.094H233.383C232.291 40.094 231.703 39.464 231.703 38.288V12.5H227.293V38.54C227.293 41.984 229.183 44 232.501 44ZM247.964 44.546C253.382 44.546 257.288 41.606 258.422 37.364H254.138C253.256 39.506 250.862 40.85 248.09 40.85C244.058 40.85 241.496 38.246 241.328 34.424H258.632V32.786C258.632 26.528 254.726 21.488 247.88 21.488C241.622 21.488 236.918 26.108 236.918 33.08C236.918 39.674 241.37 44.546 247.964 44.546ZM241.412 31.022C241.748 27.578 244.52 25.184 247.88 25.184C251.282 25.184 253.97 27.326 254.264 31.022H241.412ZM263.228 44H267.638V33.164C267.638 29.09 269.78 26.276 273.518 26.276H275.576V21.992H273.644C270.536 21.992 268.436 24.092 267.764 25.856H267.47V22.034H263.228V44Z"
                fill="black"
              />
            </Svg>
            <View
              style={{
                fontSize: "14px",
                padding: "3.2px 12.8px",
                backgroundColor: "#b5e4ca",
                borderRadius: "6px",
              }}
            >
              <Text>BIP 39</Text>
            </View>
          </View>
          <View
            style={{
              fontWeight: 400,
              fontSize: "20px",
              textAlign: "center",
              color: "#1a1d1f",
              marginBottom: "88px",
            }}
          >
            <Text>Use the Seedhodler Phraseholder to write down your generated phrases.</Text>
          </View>
          <View
            style={{
              height: selectedWordCount === 12 ? "360px" : "680px",
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            {mnemonic.map((word, index) => (
              <View
                key={index + 1}
                style={{
                  alignSelf: index <= (selectedWordCount === 12 ? 5 : 11) ? "flex-start" : "flex-end",
                  position: "relative",
                  display: "flex",
                  justifyContent: "flex-start",
                  flexDirection: "row",
                  backgroundColor: "#f4f4f4",
                  border: "1px dashed #cdcdcd",
                  borderRadius: "12px",
                  padding: "7.2px 7.2px 7.2px 3px",
                  margin: "0 10px",
                  marginBottom: "19.2px",
                  width: "46%",
                }}
              >
                <View
                  style={{
                    width: "30px",
                    display: "flex",
                    alignItems: "center",
                    color: "#6f767e",
                    marginRight: "5px",
                  }}
                >
                  <Text> {`${index + 1}.`}</Text>
                </View>
                <Text>{word}&nbsp;</Text>
              </View>
            ))}
          </View>
          <View
            style={{
              fontWeight: 400,
              fontSize: "20px",
              textAlign: "center",
              color: "#1a1d1f",
              marginBottom: "15px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>{"etc.\n In seedhodler we trust."}</Text>
          </View>
        </View>
      </Page>
      {/* <SharePages sharesNumber={sharesNumber} shares={shares} /> */}
      {shares.map((share, index) => (
        <Page key={index + 1} size="A4">
          <View
            style={{
              padding: "40px",
              margin: "10px",
              paddingBottom: "24px",
              borderRadius: "10px",
              marginBottom: "8px",
            }}
          >
            <View
              key={index + 1}
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ width: "100%" }}>
                <View
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: "15px",
                    gap: "15px",
                  }}
                >
                  <View
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      backgroundColor: "#5c58bb",
                    }}
                  />
                  <Text style={{ fontWeight: 600, fontSize: "20px", color: "#1a1d1f" }}>{`Share - ${
                    index + 1
                  }`}</Text>
                </View>
                <View style={{ height: "1px", backgroundColor: "#efefef", marginBottom: "15px" }} />
                <View
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    marginBottom: "15px",
                    height: selectedWordCount === 12 ? "650px" : "960px",
                    // marginBottom: "1.6rem",
                  }}
                >
                  {share.split(" ").map((word, index) => (
                    <View
                      key={index + 1}
                      style={{
                        alignSelf:
                          index <= (selectedWordCount === 12 ? 9 : 16) ? "flex-start" : "flex-end",
                        position: "relative",
                        display: "flex",
                        justifyContent: "flex-start",
                        flexDirection: "row",
                        backgroundColor: "#f4f4f4",
                        border: "1px dashed #cdcdcd",
                        borderRadius: "12px",
                        padding: "7.2px 7.2px 7.2px 3px",
                        margin: "0 10px",
                        marginBottom: "25px",
                        width: "46%",
                      }}
                    >
                      <View
                        style={{
                          width: "30px",
                          display: "flex",
                          alignItems: "center",
                          color: "#6f767e",
                          marginRight: "5px",
                        }}
                      >
                        <Text> {`${index + 1}.`}</Text>
                      </View>
                      <Text>{word}&nbsp;</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  )
}

export default PDFTemplate
