# Email Builder Guide

## Block Types

### Header Block
Company logo or header image.

```json
{
  "type": "header",
  "imageUrl": "https://...",
  "backgroundColor": "#ffffff",
  "height": 120
}
```

### Text Block
Rich formatted text.

```json
{
  "type": "text",
  "content": "Your message",
  "fontSize": 16,
  "textColor": "#333333"
}
```

### Metrics Block
Key performance indicators.

```json
{
  "type": "metrics",
  "items": [
    { "label": "ARR", "value": "$2.5M", "change": "+15%" }
  ]
}
```

### CTA Block
Call-to-action button.

```json
{
  "type": "cta",
  "buttonText": "View Update",
  "url": "https://...",
  "backgroundColor": "#4F46E5"
}
```

### Image Block
Display images or charts.

```json
{
  "type": "image",
  "imageUrl": "https://...",
  "caption": "Monthly growth"
}
```

### Divider Block
Visual separator.

```json
{
  "type": "divider",
  "color": "#EEEEEE",
  "height": 2
}
```

### Footer Block
Company info and links.

```json
{
  "type": "footer",
  "companyName": "Ultimate Chicken",
  "address": "123 Startup Lane",
  "website": "https://ultimatechicken.com"
}
```

## Best Practices

✅ Keep width under 600px (mobile-friendly)  
✅ Use readable font sizes (14-16px body text)  
✅ Include unsubscribe link  
✅ Add company address and contact info  
✅ Test in multiple email clients  
✅ Optimize images for web  
✅ Ensure color contrast for accessibility  

## AI Features

### Rewrite Content
Request AI suggestions for text blocks.

### Format Suggestions
Get recommendations for email structure.

### Improve Block
Enhance individual blocks (grammar, tone, clarity).

## Live Preview

- **Desktop Preview** — See responsive layout
- **Mobile Preview** — Test on common device sizes
- **Email Client Preview** — Send test emails

