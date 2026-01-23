import { ref, computed } from "vue";

// Global state using singleton pattern
const isLocked = ref(false);
const encryptedPassword = ref(null);
const LOCK_KEY = "mi_lock_data";

export function useLockSystem() {
    const initLockSystem = () => {
        const stored = localStorage.getItem(LOCK_KEY);
        if (stored) {
            try {
                const data = JSON.parse(stored);
                isLocked.value = data.isLocked;
                encryptedPassword.value = data.password;
            } catch (e) {
                console.error("Failed to load lock data", e);
            }
        }
    };

    const saveLockState = () => {
        localStorage.setItem(
            LOCK_KEY,
            JSON.stringify({
                isLocked: isLocked.value,
                password: encryptedPassword.value,
            })
        );
    };

    const hashPassword = async (password) => {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    };

    const lockApp = async (password) => {
        if (!password) return false;
        encryptedPassword.value = await hashPassword(password);
        isLocked.value = true;
        saveLockState();
        return true;
    };

    const unlockApp = async (password) => {
        if (!encryptedPassword.value) return true; // No password set, allow unlock? Or treat as error.
        const attemptHash = await hashPassword(password);
        if (attemptHash === encryptedPassword.value) {
            isLocked.value = false;
            saveLockState(); // Save state as unlocked
            return true;
        }
        return false;
    };

    // Helper to force lock state (e.g. from backup restore)
    const setLockState = (locked, passwordHash) => {
        isLocked.value = locked;
        encryptedPassword.value = passwordHash;
        saveLockState();
    };

    return {
        isLocked: computed(() => isLocked.value),
        encryptedPassword: computed(() => encryptedPassword.value),
        lockApp,
        unlockApp,
        initLockSystem,
        setLockState
    };
}
