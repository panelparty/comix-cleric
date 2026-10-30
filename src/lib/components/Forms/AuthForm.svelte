<script>

  // Svelte utilities
  import { goto, invalidateAll } from "$app/navigation";
  import { enhance } from "$app/forms";
  
  // Better Auth client
  import { authClient } from '$lib/ComixClericLib/auth-client.js';

  // Utilities
  import { isEmailDomainBanned } from "$lib/utils/validation/bannedDomains";
  import { Debounced } from "runed";
  import { toastError, toastSuccess } from '$lib/utils/toast';
  import { consoleLog } from "$lib/utils/debug";

  // Validation imports
  import {
    emailSchema,
    passSchema,
    displaynameSchema,
    usernameSchema,
    createZodValidator,
  } from '$lib/utils/validation/schema.js';

  // Components
  import PolicyModal from '$lib/components/Policies/PolicyModal.svelte';

  // Props
  let { data, register, demo } = $props();

  // Form state
  let formState = $state("login");
  let loading = $state(false);
  let name = $state();
  let displayname = $state();
  let email = $derived(demo ? data?.settings?.demo_email : null);
  let pass = $derived(demo ? data?.settings?.demo_password : null);
  let passConf = $state();
  let showPass = $state(false);
  let inUse = $state(null);

  // Reactively force form state based on database settings
  $effect(()=>{
    if (!data?.settings?.user_register || !register) {
      formState = 'login';
    } else if (!data?.settings?.user_login && (register === true && data?.settings?.user_register)) {
      formState = 'register';
    }
  });

  // Handle login submission
  async function handleLogin(e) {
    e.preventDefault();
    loading = true;
    let result;

    try {
      if (emailSchema.safeParse(email).success) {
        result = await authClient.signIn.email({
          email: email,
          password: pass,
        });
      } else {
        result = await authClient.signIn.username({
          username: email,
          password: pass,
        });
      }

      if (result.error) {
        toastError("Failed to login!", result.error.message || result.error.statusText);
      } else {
        closeAuth();
        toastSuccess("You have successfully logged in!");
        await invalidateAll();
        if (data?.isAdmin) {
          goto("/_cc_admin");
        }
      }
    } catch (error) {
      toastError("Failed to login!", error.message || "Unknown error");
    }

    loading = false;
  }

  // Handle registration submission
  async function handleRegister(e) {
    e.preventDefault();
    loading = true;

    if (pass !== passConf) {
      toastError("Registration Failed", "Passwords do not match.");
      loading = false;
      return;
    }

    try {
      const result = await authClient.signUp.email({
        email: email,
        password: pass,
        name: name,
        displayname: displayname,
      });

      if (result.error) {
        toastError("Registration Failed", result.error.message || result.error.statusText);
      } else {
        closeAuth();
        toastSuccess("Registration Successful", "Welcome aboard!");
        await invalidateAll();
      }
    } catch (error) {
      toastError("Registration Failed", error.message || "Unknown error");
    }

    loading = false;
  }

  // Handle registration submission
  const handleReset = (e) => {
    loading = true;

    return async ({ result }) => {
      consoleLog(result);
      closeAuth();
      if (result?.data?.success === true) {
        toastSuccess("If an account matching this email is found, a request is on its way!");
      } else {
        toastError("Failed to send reset!", result?.data?.error);
      }

      loading = false;
    }
  };

  // Setup modal state
  let authOpen = false;

  function closeAuth() {
    authOpen = false;
  }

  // Toggle password visibility
  function togglePass() {
    showPass = !showPass;
  }

  // Setup form validators
  const validateEmail = createZodValidator(emailSchema);
  const validateUsername = createZodValidator(usernameSchema);
  const validateDisplayname = createZodValidator(displaynameSchema);
  const validatePassword = createZodValidator(passSchema);

  //
  function checkEmailDomain(event) {
    const input = event.target;
    const email = input?.value;

    try {
      // First run Zod validation
      emailSchema.parse(email);

      // Then check blacklist
      if (isEmailDomainBanned(email) || !domainExists(email)) {
        input.setCustomValidity('This email provider is not allowed.');
      } else {
        input.setCustomValidity('');
      }
    } catch (err) {
      input.setCustomValidity(err?.errors[0]?.message);
    }
    input.reportValidity();
  }

  // Create debounce (delay) timers for inputs
  const debouncedUsername = new Debounced(() => name, 500);

  // Checks if a username already exists in the database.
  async function usernameExists() {
    // Only check the database if debounced input exists, isn't empty, and is atleast two characters long
    if (debouncedUsername.current && debouncedUsername.current != '' && debouncedUsername.current?.length > 2) {
      try {
        const res = await fetch(`/api/check-username?username=${encodeURIComponent(debouncedUsername.current)}`);
        const data = await res.json();
        inUse = data.exists;
      } catch {
        inUse = null;
      }
    } else {
      // Status is unknown/error
      inUse = null;
    }
  }

  // Run username check as often as debounce will allow.
  $effect(()=>{
    usernameExists();
  });

  // Setup TooltipInfo state
  let tooltipOpen = $state(false);

</script>

<!-- Card container -->
<div class="auth-card border max-h-[calc(100dvh-2rem)] overflow-y-auto shadow-xl shadow-surface-950/10 w-[calc(100vw-2rem)] md:max-w-sm bg-surface-50-950 p-6 rounded-2xl flex flex-col items-center">
  <!-- Display if the form astate is "login" -->
  {#if formState === "login"}
    <!-- Card heading/title -->
    <!-- TODO: Make customizable -->
    <h5 class="h5 text-center mx-auto mb-6 text-pretty leading-none">Welcome back! Please log in.</h5>
    <!-- Login form -->
    <form
      class="space-y-4"
      onsubmit={handleLogin}
    >
      <!-- Email input -->
      <input
        class="input px-4 py-3 valid:ring-success-500 invalid:ring-error-500"
        type="text"
        name="email"
        autocomplete="username"
        placeholder="Email or Username"
        required
        maxlength={64}
        bind:value={email}
        disabled={loading}
      />
      <!-- Input group -->
      <div class="input-group grid grid-cols-[auto_min-content] ">
        <!-- Password input -->
        <input
          class="ig-input rounded-l-lg px-4 py-3 valid:ring-success-500 invalid:ring-error-500"
          type="{showPass ? 'text' : 'password'}"
          name="pass"
          autocomplete="current-password"
          placeholder="Password"
          required
          minlength={6}
          maxlength={64}
          bind:value={pass}
          disabled={loading}
        />
        <!-- Password visibility toggle -->
        <button
          type="button"
          class="ig-btn"
          onclick={() => togglePass()}
          aria-label="{showPass ? 'hide' : 'show'} password"
        ><i class="ph-bold ph-{showPass ? 'eye-slash' : 'eye'}"></i></button>
      </div>
      <!-- Submit button -->
      <button
        type="submit"
        class="btn preset-filled-primary-500 py-2 px-4 w-full"
        disabled={loading}
        >Log In</button
      >
    </form>

    <!-- If users are allowed to register -->
    {#if register === true && data?.settings?.user_register === true}
    <div class="mt-6 mx-auto w-fit text-center">
      <!-- Call to action -->
      <p class="leading-none">Need an account?</p>
      <!-- Changes form to registration mode -->
      <button
        onclick={() => {
          formState = "register";
        }}
        class="underline text-primary-500 hover:opacity-60">Register</button
      >
    </div>
    {/if}
    <div class="mt-6 mx-auto w-fit text-center">
      <button type="button" class="anchor" onclick={()=>{formState = "forgot-password"}}>Forgot Password</button>
    </div>
  <!-- If the form is in registration mode -->
  {:else if formState === "register" && data?.settings?.user_register === true}
    <!-- Card heading/title -->
    <!-- TODO: Make customizable -->
    <h5 class="h5 text-center mx-auto mb-6 text-pretty leading-none">
      Welcome! We're glad you're here!
    </h5>
    <!-- Registration form -->
    <form
      class="space-y-4"
      onsubmit={handleRegister}
    >
      <!-- Email input -->
      <label class="">
        <input
          class="input  px-4 py-3 valid:ring-success-500 invalid:ring-error-500"
          type="email"
          name="email"
          placeholder="Email"
          required
          maxlength={64}
          bind:value={email}
          disabled={loading}
          oninput={validateEmail}
          onblur={checkEmailDomain}
        />
        <span class="text-xs text-current/40 mt-1">Max: 64 characters</span>
      </label>
      <!-- Username input group -->
      <div class="">
        <div class="input-group grid grid-cols-[min-content_auto] ">
          <!-- TooltipInfo component (Skeleton UI) -->
          <TooltipInfo
            triggerBase="ig-cell h-full rounded-l-lg {inUse === null ? 'text-surface-700-300 bg-surface-100-900 border-current' : inUse ? 'text-error-500 !bg-error-100-900 !border-current' : 'text-success-500 !bg-success-100-900 !border-current'}"
            open={tooltipOpen}
            onOpenChange={(e) => (tooltipOpen = e.open)}
            positioning={{ placement: 'bottom' }}
            contentBase=" p-2 {inUse === null ? 'text-surface-700-300 bg-surface-100-900 border-current' : inUse ? 'text-error-500 !bg-error-100-900 !border-current' : 'text-success-500 !bg-success-100-900 !border-current'}"
            openDelay={200}
          >
            <!-- Trigger -->
            {#snippet trigger()}
              <!-- Icon for username status -->
              <i aria-label="Username is {inUse ? 'already in use.' : 'available!'}" class="text-lg ph-fill {inUse === null ? 'ph-minus-circle' : inUse ? 'ph-x-circle' : 'ph-check-circle'}"></i>
            {/snippet}
            <!-- Content -->
            {#snippet content()}
              <!-- Further information about username status -->
              <p>Username is {inUse === null ? 'invalid.' : inUse ? 'already in use.' : 'available!'}</p>
            {/snippet}
          </TooltipInfo>
          <!-- Username input -->
          <input
            class="ig-input rounded-r-lg px-4 py-3 valid:ring-success-500 invalid:ring-error-500"
            type="text"
            name="username"
            placeholder="Username"
            required
            minlength={3}
            maxlength={24}
            bind:value={name}
            disabled={loading}
            oninput={validateUsername}
          />
        </div>
        <p class="text-xs text-current/40 mt-1">Min: 3, Max: 24, only letters, numbers, periods, underscores, and hyphens are allowed.</p>
      </div>
      <!-- Displayname input -->
      <label class="">
        <input
          class="input  px-4 py-3 valid:ring-success-500 invalid:ring-error-500"
          type="text"
          name="displayname"
          placeholder="Displayname"
          required
          minlength={3}
          maxlength={32}
          bind:value={displayname}
          disabled={loading}
          oninput={validateDisplayname}
        />
        <span class="text-xs text-current/40 mt-1">Min: 3, Max: 32</span>
      </label>
      <!-- Password input group -->
      <div class="">
        <div class="input-group grid grid-cols-[auto_min-content] ">
          <!-- Password input -->
          <input
            class="ig-input rounded-l-lg px-4 py-3 valid:ring-success-500 invalid:ring-error-500"
            type="{showPass ? 'text' : 'password'}"
            name="pass"
            placeholder="Password"
            required
            minlength={8}
            maxlength={64}
            bind:value={pass}
            disabled={loading}
            oninput={validatePassword}
          />
          <!-- Password visibility toggle -->
          <button type="button" class="ig-btn" onclick={() => togglePass()} aria-label="{showPass ? 'hide' : 'show'} password"><i class="ph-bold ph-{showPass ? 'eye-slash' : 'eye'}"></i></button>
        </div>
        <p class="text-xs text-current/40 mt-1">Min: 8, Max: 64, Must contain at least 1 uppercase and lowercase letter, number, and special character (!@#$%^&*).</p>
      </div>
      <!-- Password confirm input group -->
      <div class="">
        <div class="input-group grid grid-cols-[auto_min-content] ">
          <!-- Password confirm input -->
          <input
            class="ig-input rounded-l-lg px-4 py-3 valid:ring-success-500 invalid:ring-error-500"
            type="{showPass ? 'text' : 'password'}"
            name="passConfirm"
            placeholder="Re-type Password"
            required
            minlength="8"
            maxlength="64"
            bind:value={passConf}
            disabled={loading}
            oninput={validatePassword}
          />
          <!-- Password visibility toggle -->
          <button type="button" class="ig-btn" onclick={() => togglePass()} aria-label="{showPass ? 'hide' : 'show'} password"><i class="ph-bold ph-{showPass ? 'eye-slash' : 'eye'}"></i></button>
        </div>
        <p class="text-xs text-current/40 mt-1">Must match the password entered above.</p>
      </div>
      <!-- PolicyModal Disclaimer -->
      <!-- TODO: Make this customizable -->
      <div class="text-sm leading-none">
        <p>By creating an account, you're confirming that you've read and agree to our <PolicyModal class="text-success-500 font-bold inline" /></p>
      </div>
      <!-- Submit button -->
      <button
        type="submit"
        class="btn preset-filled-primary-500 py-2 px-4 w-full"
        onclick={()=>{showPass = 'password'}}
        disabled={loading}
      >Register</button>
    </form>
    <!-- If users are allowed to log-in -->
    <div class="mt-6 mx-auto w-fit text-center">
      <!-- Call to action -->
      <!-- TODO: Make customizable -->
      <p class="leading-none">Already have an account?</p>
      <!-- Changes form to login mode -->
      <button
        onclick={() => {
          formState = "login";
        }}
        class="underline text-primary-500 hover:opacity-60">Log In</button
      >
    </div>
  {:else if formState === "forgot-password"}
    <form
      method="POST"
      action="/api/auth/forgotPassword?/request"
      use:enhance={handleReset}
      class="space-y-4"
    >
      <h5 class="h5 text-center mx-auto mb-6 text-pretty leading-none">
        Request Password Reset
      </h5>

      <div class="">
        <input
          class="input rounded-lg px-4 py-2 user-valid:ring-success-500 user-invalid:ring-error-500"
          type="email"
          name="email"
          placeholder="Email"
          bind:value={email}
          disabled={loading}
          oninput={validateEmail}
        />
      </div>

      <button
        type="submit"
        class="btn preset-filled-success-500 rounded-lg py-2 px-4 w-full" disabled={loading}
      >Send Reset Link</button>
    </form>
    <div class="mt-6 mx-auto w-fit text-center">
      <button
        onclick={() => {
          formState = "login";
        }}
        class="underline text-primary-500 hover:opacity-60">Back to Log In</button
      >
    </div>
  {:else}
    <!-- Invalid form state -->
    <p class="">You may not access the form at this time.</p>
  {/if}
</div>
