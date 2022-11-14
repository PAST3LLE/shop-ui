import styled from 'styled-components/macro'
import Button, { ButtonBaseProps, ButtonSizeVariations, ButtonVariations } from '../Button'

const ThemeButtonToggleWrapper = styled.div<{ disabled: boolean; $mode: boolean; $margin?: string; $width?: string }>`
  display: inline-flex;
  width: ${({ $width = '6rem' }): string => $width};
  background-color: #f8f8ff47;
  border-radius: 2rem;
  margin: ${({ $margin = '0' }): string => $margin};

  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  > button {
    border-radius: 2rem;
    width: 75%;
    margin-left: ${({ $mode }): string => ($mode ? 'auto' : '0')};

    display: flex;
    justify-content: center;
  }
`

export const ThemeToggle: React.FC<ButtonBaseProps & {
  mode: boolean
  margin?: string
  width?: string
  disabled?: boolean
}> = ({
  disabled = false,
  mode,
  margin,
  width,
  size = ButtonSizeVariations.SMALL,
  variant = ButtonVariations.THEME,
  children,
  ...rest
}) => {
  return (
    <ThemeButtonToggleWrapper
      disabled={disabled}
      $mode={mode}
      $margin={margin}
      $width={width}
      title={disabled ? 'Toggled' : 'Click to toggle theme'}
    >
      <Button {...rest} disabled={disabled} size={size} variant={variant}>
        {children}
      </Button>
    </ThemeButtonToggleWrapper>
  )
}
