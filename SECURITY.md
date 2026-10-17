# Security

**Keep in mind that Comix Cleric is a non-commercial, open source project, maintained entirely by a single developer and small group of volunteers, and there are no bounties!**

Only the latest version of the app is actively maintained by the core developers, older versions are not elligible for offical patches.

If you want to *responsibly* report a security issue you'll have to reach out as a human to **helloworld at panelparty.net**.

Be aware, as we are a small team, we will not tolerate abuse against us or our projects.

This means:
- Keep your tone light and informative, not arrogant and over-confident.
- No threatening deadlines, 60-90 days is a more than reasonable fix timeline.
- We <u>will not</u> access your security platform to read a report
- No exaggerated serverity, we will determine the scope of the issue
- We will not accept **any** AI/LLM-generated reports or replies

Reports violating the above guidelines will not be reviewed, regardless of their validity.

**In other words, simply *"Heads-up, I may have found a security issue in ____."* is enough to properly begin a review.**

We try to respond to security reports within a day, but if you haven't heard from us in over a week, try reaching out again, or check that your messages were actually sent.

In cases where a vulnerability is confirmed:

- We will start working on a local fix.
- Once the fix is complete, we will announce a date for the next patch to be applied.
- After the patch is applied, we will publish a security advisory and CVE with steps to resolve the issue and *minimal* details regarding the original exploit.

> [!IMPORTANT]
> You are free to publish your PoC and more details in your own blog, but we ask that you wait at least a week after the release to allow enough time for people to patch their instances before making it more widely-known.

---

### Older Versions

There may be cases where community maintainers can submit PRs for older versions to apply current patches to keep their favorite version alive.

These package versions are not officially supported, and there is no guarantee that your favorite version will recieve a patch.

If a patch is applied to an older version and a PR is accepted, an official Docker image will be built to support it.
