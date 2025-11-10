# Testing Guide - Supabase Integration

## ✅ What's Been Implemented

1. **Real Supabase Authentication**
   - Sign in with email/password
   - Sign up new users
   - Session persistence (stays logged in)
   - Sign out functionality

2. **Assessment Submission**
   - Submit button in side drawer
   - Saves to Supabase database
   - Includes all form data (ProjectSummary + SiteGrounds)
   - Shows success/error alerts

3. **Database Schema**
   - 4 tables created in Supabase
   - Row Level Security enabled
   - Users can only see their own data

---

## 🧪 How to Test

### Step 1: Start Your App

```bash
npm run start
```

Make sure your `.env.local` file is in place with your Supabase credentials.

---

### Step 2: Create an Account

1. Open your app
2. You'll see the **Login Screen**
3. Click **"Need an account? Sign up"**
4. Enter:
   - Email: `test@example.com` (or your real email)
   - Password: `password123` (at least 6 characters)
5. Click **"Sign Up"**

**What happens:**
- Account is created in Supabase Auth
- You're automatically logged in
- Redirected to main app

**Note:** By default, Supabase requires email confirmation. If you get an error, check your Supabase settings:
- Dashboard → Authentication → Providers → Email
- Turn OFF "Confirm email" for testing

---

### Step 3: Fill Out Some Form Data

1. Navigate through your forms
2. Fill in some test data in:
   - Project Summary (any step)
   - Site & Grounds (any step)
3. Data saves automatically to local MST store

---

### Step 4: Submit to Supabase

1. Open the **Side Drawer** (menu icon)
2. Scroll to the bottom
3. You should see:
   - Your email address
   - **"Submit Assessment"** button (blue)
   - **"Sign Out"** button (gray)
4. Click **"Submit Assessment"**
5. Confirm in the alert
6. Wait for success message

**What happens:**
- Assessment data is uploaded to Supabase
- All your form data is saved
- Console shows progress logs

---

### Step 5: Verify in Supabase Dashboard

1. Go to [app.supabase.com](https://app.supabase.com)
2. Open your project
3. Go to **Table Editor**
4. Click on **assessments** table
5. You should see 1 row with your assessment!
6. Check **project_summaries** table - should have your data
7. Check **site_grounds** table - should have your data

---

## 🔍 What to Check

### In the App:

- [ ] Can sign up new account
- [ ] Can sign in with existing account
- [ ] Session persists after app restart
- [ ] Can fill out form data
- [ ] Submit button appears in drawer
- [ ] Submit shows success alert
- [ ] Can sign out

### In Supabase Dashboard:

- [ ] Assessment appears in `assessments` table
- [ ] Data appears in `project_summaries` table
- [ ] Data appears in `site_grounds` table
- [ ] `user_id` matches your auth user ID
- [ ] Timestamps are correct
- [ ] JSONB fields (documents, step1, etc.) have data

---

## 🐛 Common Issues

### Issue: "Invalid API key"
**Solution:** Double-check your `.env.local` file has correct values

### Issue: "Not authenticated"
**Solution:** 
- Sign out and sign in again
- Check console for auth errors

### Issue: "Permission denied" or "Row Level Security"
**Solution:**
- Make sure you ran the ENTIRE SQL schema
- Check that policies were created (see SQL Editor → Policies)

### Issue: Submit does nothing
**Solution:**
- Check Metro bundler console for errors
- Look for red error messages
- Verify you have an active assessment

### Issue: Assessment ID is weird (assessment_123...)
**Solution:** This is normal! It's your local MST store ID format

---

## 📊 Console Logs to Watch

When submitting, you should see:
```
📤 Starting assessment submission...
📋 Assessment snapshot: assessment_1234567890_abc123
✅ Assessment record saved
✅ Project summary saved
✅ Site grounds saved
🎉 Assessment submitted successfully!
```

If you see ❌ errors, read the message carefully.

---

## 🔐 Security Notes

**Current Setup:**
- ✅ Row Level Security enabled
- ✅ Users can only see their own data
- ✅ Auth token stored securely in AsyncStorage
- ✅ API keys are public (safe for client apps)

**Not Yet Implemented:**
- ⚠️ No data encryption at rest
- ⚠️ No photo upload yet
- ⚠️ No automatic sync (manual submit only)

---

## 📝 Data Flow Diagram

```
User fills form
      ↓
Data saved to MST Store (local)
      ↓
Data saved to MMKV (persistent local)
      ↓
User clicks "Submit Assessment"
      ↓
getSnapshot(assessment) → JSON
      ↓
Upload to Supabase via API
      ↓
Data saved to PostgreSQL
      ↓
Success! ✅
```

---

## 🎯 Next Steps

After verifying this works:

1. **Add Photo Upload** - Wire up camera button
2. **Add Sync Indicator** - Show when data is synced
3. **Add Pull to Refresh** - Download assessments from server
4. **Add Conflict Resolution** - Handle multiple devices
5. **Add PowerSync** (optional) - For automatic background sync

---

## 💡 Tips

- **Test with real data:** Try filling out an actual assessment
- **Test offline:** Turn off WiFi, fill forms, turn WiFi back on, submit
- **Test multiple assessments:** Create several, submit each one
- **Test sign out/in:** Make sure data persists
- **Check Supabase logs:** Dashboard → Logs → see all API calls

---

Need help? Check the console logs first - they're very detailed!

