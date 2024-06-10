import { ErgoAddress, OutputBuilder, RECOMMENDED_MIN_FEE_VALUE, TransactionBuilder } from "@fleet-sdk/core";
import { SByte, SColl } from "@fleet-sdk/serializer";

const DEV_FEE_DENOMINATOR = 100n; // 1%

export async function buyTx(contractBox: any, buyerBase58PK: string, buyerUtxos: Array<any>, height: number, tokenPrice: bigint, sellerBase58PK: string, devBase58PK: string): any {
    const buyerAddress = ErgoAddress.fromBase58(buyerBase58PK);
    let outputs = [];

    // Check if buyer and seller PK match
    const isWithdrawal = buyerBase58PK === sellerBase58PK;

    if (isWithdrawal) {
        const cancelOrderValue = BigInt(10000000); // Value for cancel order in nanoERG (0.01 ERG)
        
        // Send 0.01 ERG to the dev address for the cancellation fee
        outputs.push(new OutputBuilder(
            cancelOrderValue,
            devBase58PK
        ));

        // Return assets to the seller
        outputs.push(new OutputBuilder(
            contractBox.value,
            sellerBase58PK
        ).addTokens(contractBox.assets));
    } else {
        const sellerBox = new OutputBuilder(
            tokenPrice - tokenPrice / DEV_FEE_DENOMINATOR,
            sellerBase58PK
        ).setAdditionalRegisters({
            R4: SColl(SByte, contractBox.boxId).toHex(),
        });

        outputs.push(sellerBox);

        const feeBox = new OutputBuilder(
            tokenPrice / DEV_FEE_DENOMINATOR,
            devBase58PK
        );

        outputs.push(feeBox);
    }

    const unsignedMintTransaction = new TransactionBuilder(height)
        .configureSelector((selector) => selector.ensureInclusion(contractBox.boxId))
        .from([contractBox, ...buyerUtxos])
        .to(outputs)
        .sendChangeTo(buyerAddress)
        .payFee(RECOMMENDED_MIN_FEE_VALUE)
        .build()
        .toEIP12Object();

    return unsignedMintTransaction;
}
