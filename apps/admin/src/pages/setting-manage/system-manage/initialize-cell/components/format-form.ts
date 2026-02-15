/**
 * Format confirmation form data
 */
export interface FormatConfirmationFormVO {
	/** Developer password */
	developerPassword: string;
}

/**
 * Default form
 * @description Exported for external use
 */
export const defaultForm: FormatConfirmationFormVO = {
	developerPassword: "",
};

/**
 * Format confirmation form props
 * @description
 * Using longer type name to avoid global type conflicts
 */
export interface FormatFormProps {
	/** Form data */
	form: FormatConfirmationFormVO;
	/** Default values for form reset */
	defaultValues: FormatConfirmationFormVO;
	/** Initialize item */
	initItem: string;
	/** Initialize status */
	initStatus: string;
}
