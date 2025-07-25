import React from 'react'
import styles from './Button.module.css'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  children: React.ReactNode
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  onClick 
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size]
  ].join(' ')

  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
