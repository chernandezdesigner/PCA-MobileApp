# Supabase Setup Guide

## ✅ Steps 1-5 Complete!

You've already completed:
- ✅ Created Supabase project
- ✅ Got credentials (URL + anon key)
- ✅ Added credentials to `.env.local`
- ✅ Installed dependencies
- ✅ Created Supabase client files

---

## Step 6: Create Database Tables (15 minutes)

### Instructions:

1. **Open Supabase Dashboard**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Select your `pca-mobile-app` project

2. **Open SQL Editor**
   - In left sidebar, click **SQL Editor** (icon looks like `</>`)
   - Click **+ New Query** button (top right)

3. **Copy & Paste SQL**
   - Open the file `supabase-schema.sql` in your project root
   - Copy the ENTIRE contents
   - Paste into the Supabase SQL Editor

4. **Run the SQL**
   - Click **Run** button (bottom right) or press `Ctrl/Cmd + Enter`
   - Wait ~5-10 seconds
   - You should see: `Success. No rows returned`

5. **Verify Tables Were Created**
   - In left sidebar, click **Table Editor** (icon looks like a table grid)
   - You should see 4 new tables:
     - `assessments`
     - `project_summaries`
     - `site_grounds`
     - `photos`

6. **Check One Table**
   - Click on `assessments` table
   - You should see columns: `id`, `user_id`, `status`, `created_at`, etc.
   - Table will be empty (no rows yet) - that's correct!

### What Did This Do?

- Created 4 tables for your app data
- Set up Row Level Security (RLS) so users only see their own data
- Created indexes for fast queries
- Set up auto-updating timestamps

---

## Step 7: Test Connection (10 minutes)

Now let's verify your app can connect to Supabase.

### Option A: Quick Console Test (Easiest)

1. **Restart your dev server**
   ```bash
   npm run start
   ```

2. **Open your app** in simulator/emulator

3. **Open React Native Debugger or Metro console**

4. **In any screen**, add this temporary code to test:

```typescript
import { testSupabaseConnection } from '@/services/supabase'

// In your component, add this temporarily:
useEffect(() => {
  testSupabaseConnection().then(result => {
    console.log('Connection test result:', result)
  })
}, [])
```

5. **Check console output**
   - ✅ If successful: `"Supabase connection working perfectly!"`
   - ⚠️ If error: Read the error message carefully

### Option B: Test from Login Screen (Better)

We'll test on your actual login screen in the next step.

---

## Common Issues & Solutions

### Issue 1: "Invalid API key"
**Solution:** Double-check your `.env.local` file has correct credentials

### Issue 2: "relation 'assessments' does not exist"
**Solution:** You haven't run the SQL yet. Go back to Step 6.

### Issue 3: "Environment variable not defined"
**Solution:** 
- Make sure `.env.local` exists in project root
- Restart Metro bundler: Stop it (Ctrl+C) and run `npm run start` again
- Sometimes need to clear cache: `npm run start -- --clear`

### Issue 4: Nothing happens
**Solution:** Check the console logs. Metro bundler shows logs from your app.

---

## Next Steps (After Connection Works)

Once connection test passes, we'll:
1. Update LoginScreen to use real Supabase auth
2. Add a "Submit Assessment" button
3. Save one assessment to Supabase
4. Verify it appears in database

---

## Need Help?

- **Check Supabase logs:** Dashboard → Logs → see any errors
- **Check table structure:** Table Editor → click table → see columns
- **Test in Supabase directly:** SQL Editor → run `SELECT * FROM assessments`

