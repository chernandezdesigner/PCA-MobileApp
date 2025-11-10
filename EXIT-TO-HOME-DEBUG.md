# Exit to Home - Debugging Guide

## 🔧 Changes Made

Added comprehensive fixes and debugging:

### 1. Platform-Specific Handling
- **Web:** Uses `window.confirm()` (Alert.alert doesn't work properly on web)
- **Native:** Uses `Alert.alert()` as normal

### 2. Timing Delays
- **Web:** 100ms delay after closing drawer
- **Native:** 300ms delay after closing drawer
- Ensures drawer animation completes before navigation

### 3. Console Logging
Added detailed console logs to trace execution:
- 🏠 When button is clicked
- 🔍 Navigation ref readiness check
- 👍 When user confirms
- 🚫 When user cancels
- 🚀 When navigation attempt starts
- ✅ When navigation command sent
- ❌ Any errors that occur

---

## 🧪 Testing Steps

### Step 1: Open Console
**Web:**
1. Open browser DevTools (F12 or Right-click → Inspect)
2. Go to Console tab

**React Native:**
1. Run `npm start`
2. Press `j` to open debugger
3. Look at console

### Step 2: Test Exit to Home
1. Navigate to any assessment form
2. Open side drawer (click menu icon or "Next Form")
3. Scroll to bottom
4. Click **"Exit to Home"** button
5. **Watch the console** for log messages
6. Confirm in dialog

### Step 3: Check Console Output

**Expected Logs (Success):**
```
🏠 Exit to Home clicked
🔍 Navigation ref ready? true
👍 User confirmed, closing drawer
🚀 Attempting navigation to Home
✅ Navigation command sent
```

**If It Fails, Look For:**
```
❌ Navigation ref not ready
```
OR
```
❌ Navigation error: [error message]
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Navigation ref not ready"
**Cause:** Navigation hasn't initialized yet  
**Solution:** This shouldn't happen, but if it does, the app needs to finish mounting first

### Issue 2: Button clicks but nothing happens
**Check:**
1. Is `onClose` function being passed to SideDrawer?
2. Check console - are ANY logs appearing?
3. If no logs, the button might not be wired correctly

### Issue 3: Error about route "Home" not found
**Check:**
1. Verify HomeScreen is registered in AppNavigator
2. Check spelling: "Home" (capital H)

### Issue 4: Drawer doesn't close
**Check:**
1. `onClose` callback is working
2. DrawerContext is providing the close function

---

## 📊 What Should Happen

### Sequence of Events:
1. **Click "Exit to Home"**
   - Console: `🏠 Exit to Home clicked`
   
2. **Confirm Dialog**
   - User clicks "Exit to Home" (or OK on web)
   - Console: `👍 User confirmed, closing drawer`

3. **Drawer Closes**
   - `onClose()` is called
   - Drawer slide animation starts
   - Wait 100-300ms

4. **Navigation Executes**
   - Console: `🚀 Attempting navigation to Home`
   - Check if nav ref ready
   - Call `resetRoot()`
   - Console: `✅ Navigation command sent`

5. **Screen Changes**
   - App navigator resets to Home screen
   - You see the home screen with assessment lists

---

## 🔍 Debug Information to Share

If it's still not working, please share:

1. **Console output** after clicking Exit to Home
2. **Platform** you're testing on (web/iOS/Android)
3. **Any error messages** in console
4. **Does the confirm dialog appear?**
5. **Does the drawer close?**

---

## 💡 Quick Tests

### Test A: Check Navigation Ref
Add this anywhere in a component:
```typescript
import { navigationRef } from "@/navigators/navigationUtilities"

console.log('Nav ready?', navigationRef.isReady())
```

Should log `true` after app loads.

### Test B: Test resetRoot Directly
In browser console or React Native debugger:
```javascript
// Import navigationRef somewhere and expose it globally for testing
window.navRef = navigationRef

// Then in console:
window.navRef.resetRoot({ index: 0, routes: [{ name: "Home" }] })
```

If this works, navigation is fine and the issue is in the button handler.

### Test C: Simple Navigation Test
Temporarily replace the handler with:
```typescript
const handleExitToHome = () => {
  console.log('TEST: Closing drawer')
  onClose?.()
  
  setTimeout(() => {
    console.log('TEST: Navigating')
    navigate("Home")  // Try simple navigate first
  }, 300)
}
```

If simple `navigate()` works but `resetRoot()` doesn't, that's useful info.

---

## 🎯 Expected Behavior

**When Working Correctly:**
- ✅ Click button → Confirm dialog appears
- ✅ Click confirm → Drawer closes smoothly
- ✅ After 100-300ms → Screen changes to Home
- ✅ Home screen shows your assessments list
- ✅ No errors in console

**Currently Not Working:**
- ❓ Which step fails? (check console logs)
- ❓ Does dialog appear?
- ❓ Does drawer close?
- ❓ Does navigation attempt?
- ❓ Any errors?

---

## 📝 Next Steps

1. **Test now** and check console logs
2. **Share the console output** showing what happens
3. Based on logs, we can pinpoint the exact issue
4. May need to adjust timing, try different navigation method, or check drawer context

The detailed logging will help us see exactly where it's failing!

