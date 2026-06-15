'use client'

import { useState } from 'react'
import { InputHTMLAttributes } from 'react'
import styles from './auth.module.css'

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement>

export function PasswordInput(props: PasswordInputProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className={styles.passwordInputContainer}>
            <input
                {...props}
                type={showPassword ? 'text' : 'password'}
            />

            <button
                type='button'
                className={styles.passwordToggle}
                onClick={() => setShowPassword(prev => !prev)}
            >
                {showPassword ? '🙈' : '👁'}
            </button>
        </div>
    )
}