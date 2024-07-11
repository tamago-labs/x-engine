import BaseModal from "./base"



const Settings = ({ visible, close }) => {
    return (
        <BaseModal
            visible={visible}
            title="Settings"
            close={close}
        >
            Settings
        </BaseModal>
    )
}

export default Settings