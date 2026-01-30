# URL Shortener – System Design Roadmap

This document tracks feature ideas and system design improvements for my Cloudflare-based URL shortener.  
Each item is intentionally small so it can be picked up and implemented one by one.

---

## Core Enhancements

- **User Authentication**  
  Add authentication for managing user-owned URLs.

- **URL Ownership**  
  Associate short URLs with users and enforce access control.

- **Custom Aliases**  
  Allow users to create human-readable short codes with collision handling.

- **URL Expiration**  
  Support time-based expiration and automatic invalidation.

- **One-Time URLs**  
  Enable links that self-destruct after a single successful redirect.

---

## Caching & Data Consistency

- **Cache Write-Through**  
  Populate KV automatically after fetching a short URL from D1.

- **Negative Caching**  
  Cache non-existent short codes to reduce repeated database lookups.

- **Adaptive Cache TTL**  
  Increase KV TTL dynamically for frequently accessed links.

---

## Analytics & Observability

- **Click Tracking**  
  Record redirect events asynchronously without blocking responses.

- **Geo Analytics**  
  Capture country and region data using Cloudflare request headers.

- **Device & Referrer Tracking**  
  Store user-agent and referrer metadata for traffic insights.

- **Aggregated Metrics**  
  Periodically roll up raw click events into daily summaries.

---

## Rate Limiting & Abuse Prevention

- **IP-Based Rate Limiting**  
  Limit redirects per IP to prevent scraping and abuse.

- **API Key Rate Limiting**  
  Enforce per-user quotas on URL creation and updates.

- **Malicious URL Detection**  
  Block known phishing or malware destinations during URL creation.

---

## Edge Consistency (Durable Objects)

- **Atomic Click Counters**  
  Use Durable Objects for strongly consistent click counts.

- **Hot-Link Protection**  
  Prevent traffic spikes from overwhelming a single short URL.

- **One-Time Link Enforcement**  
  Guarantee single-use behavior using atomic state updates.

---

## Cloudflare Edge Features

- **Geo-Based Redirects**  
  Redirect users to different destinations based on country.

- **A/B Redirect Testing**  
  Split traffic across multiple destinations for experimentation.

- **Canary Redirects**  
  Gradually shift traffic to a new destination URL.

---

## Reliability & Resilience

- **Graceful KV Fallback**  
  Serve redirects from cache when D1 is slow or unavailable.

- **Failure Injection**  
  Simulate KV or D1 outages to validate fallback behavior.

- **Timeout Protection**  
  Enforce strict timeouts to keep edge latency predictable.

---

## Developer Experience & Operations

- **Structured Logging**  
  Add request IDs and structured logs for debugging.

- **Redirect Latency Metrics**  
  Track P50 and P95 redirect latency.

- **Cache Hit Ratio Metrics**  
  Monitor KV effectiveness over time.

---

## Advanced / Stretch Goals

- **Snowflake ID Generator**  
  Generate globally unique short codes at the edge.

- **Bloom Filter Existence Check**  
  Reduce D1 reads with probabilistic existence checks.

- **Shard Routing Strategy**  
  Route requests using consistent hashing for scalability.

---

## Task Guidelines

For each task, document:

- Goal
- Data stores used (KV / D1 / Durable Objects)
- Consistency model
- Failure and fallback behavior
