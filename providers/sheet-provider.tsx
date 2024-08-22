"use client"

import { useMountedState } from "react-use"

// import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet"
// import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";
import { NewCategorySheet } from "@/features/categories/components/new-category-sheet";
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet";
import { NewSizeSheet } from "@/features/sizes/components/new-size-sheet";
import { EditSizeSheet } from "@/features/sizes/components/edit-size-sheet";
import { NewColorSheet } from "@/features/colors/components/new-color-sheet";
import { EditColorSheet } from "@/features/colors/components/edit-color-sheet";
import PreviewModal from "@/components/preview-modal";
import { EditExpensisSheet } from "@/features/expensis/components/edit-expensis-sheet";
import { NewExpensisSheet } from "@/features/expensis/components/new-expensis-sheet";
import { EditAdminSheet } from "@/features/admin/components/edit-admin-sheet";
import { NewAdminSheet } from "@/features/admin/components/new-admin-sheet";
import { UpdateOrderSheet } from "@/features/orders/components/update-order-sheet";
import { I18nextProvider } from "react-i18next";
import i18n from "@/components/lang";
// import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet";
// import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction-sheet";
// import { SubscriptionModal } from "@/features/subscriptions/components/subscription-modal";


export const SheetProvider = () => {

    const isMounted = useMountedState();

    if (!isMounted) {
        return null;
    }

    return (
        <>

            <NewCategorySheet />
            <EditCategorySheet />
            <NewSizeSheet />
            <EditSizeSheet />
            <NewColorSheet />
            <EditColorSheet />
            <EditExpensisSheet />
            <NewExpensisSheet />
            <EditAdminSheet />
            <NewAdminSheet />
            <UpdateOrderSheet />
            <PreviewModal />
            <I18nextProvider i18n={i18n} />

        </>
    )
}

