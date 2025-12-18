import * as React from "react"

const API_URL = process.env.EXPO_PUBLIC_API_URL

export const useTransactions = (userId: string) => {
    const [transactions, setTransactions] = React.useState([])
    const [summary, setSummary] = React.useState({
        balance: 0,
        income: 0,
        expenses: 0
    })
    const [loading, setLoading] = React.useState(true)
}