export const sellForErg = `
{
    val priceNanoErg     	= SELF.R4[Long].get         // token sale price in nanoErg
    val sellerPK 			= SELF.R5[SigmaProp].get    // Public Key of the token seller
    val devPK			    = SELF.R6[SigmaProp].get    // dev Public Key
    val cancelOrder         = 10000000L                 // cancel order value in nanoErg (0.01 ERG)

    val feeDenom 			= 100000L
    val feeNum   			= 1000L                     // 1% fee
    val feeInNanoErg   		= (priceNanoErg.toBigInt * feeNum.toBigInt) / feeDenom.toBigInt
    val onlyOneBoxSpent		= (OUTPUTS(0).R4[Coll[Byte]].get == SELF.id)
    val sellerHappy			= (OUTPUTS(0).value >= priceNanoErg - feeInNanoErg) && (OUTPUTS(0).propositionBytes == sellerPK.propBytes)
    val feePaid				= (feeInNanoErg == 0) ||
                              (OUTPUTS(1).value >= feeInNanoErg && OUTPUTS(1).propositionBytes == devPK.propBytes)
    val cancelOrderValid    = ((OUTPUTS(0).value == cancelOrder) && (OUTPUTS(0).propositionBytes == sellerPK.propBytes) && (OUTPUTS(1).propositionBytes == devPK.propBytes))

    sigmaProp((onlyOneBoxSpent && sellerHappy && feePaid) || cancelOrderValid) || sellerPK
}
`

export const CONTRACT  = '6yz51NUtPRmyfaGWvEPfcCRTeujKs9EpEnz7Yo2oxCbqWtUcyyjLenqzCz31MmwnLQwNc4QAA59M9pWZhczJhW2YPEK5FWsDPC526SsKg1id4q1Y3vzfJHcC7kviQLvM3anrvscKiucZkw5fpHkc8zNoEcS6opQ1ZpyNbrdWrJEi1MyESxk3GEEf5Tmt6iceXXVYnquo2Eddetdn5j4cRzzuqnRvgJvtnJGeHJ9G5';
export const DEV_PK    = '9fCMmB72WcFLseNx6QANheTCrDjKeb9FzdFNTdBREt2FzHTmusY'
