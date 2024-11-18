![leftover-high-resolution-logo-transparent](https://github.com/user-attachments/assets/91515da0-1b7e-4939-8830-1f17acc09e0e)

This app connects users with restaurants and stores that offer surplus food at a discount, making it easy for consumers to access quality food affordably while reducing food waste in Tunisia.

# App Main Features

- User Authentication
- User Profile Management
- Store Management
- Store Search and Discovery
- Surprise Bag Management
- Order and Reservation
- Review and Rating
- Analytics and Reporting
- System Administration

# Main Class Diagram

```mermaid
classDiagram
    %% User Management
    class User {
        -int userId
        -string firstName
        -string lastName
        -string email
        -string password
        -string phoneNumber
        -string address
        -DateTime createdAt
        -UserStatus status
        +register() bool
        +login() bool
        +updateProfile() bool
        +resetPassword() bool
    }

    class Customer {
        -List~Order~ orderHistory
        -List~Store~ favoriteStores
        -float rating
        +searchNearbyStores(location: Location) List~Store~
        +makeReservation(surpriseBag: SurpriseBag) Order
        +cancelReservation(order: Order) bool
        +rateStore(store: Store, rating: Rating) bool
        +addToFavorites(store: Store) bool
        +viewOrderHistory() List~Order~
    }

    class Store {
        -string storeName
        -string description
        -StoreCategory category
        -Schedule pickupWindows
        -bool isVerified
        -float averageRating
        -List~SurpriseBag~ activeBags
        -Location location
        -string photoUrl
        -float averageBagValue
        +updateStoreInfo() bool
        +addSurpriseBag(bag: SurpriseBag) bool
        +removeSurpriseBag(bagId: int) bool
        +updatePickupWindows(windows: Schedule) bool
        +viewStatistics() Statistics
        +respondToReview(review: Review, response: string) bool
    }

    class SurpriseBag {
        -int bagId
        -string name
        -string description
        -float originalValue
        -float discountedPrice
        -int quantity
        -MealType mealType
        -List~string~ allergenInfo
        -DateTime pickupStart
        -DateTime pickupEnd
        -BagStatus status
        +createBag() bool
        +updateBag() bool
        +updateQuantity(quantity: int) bool
        +markAsReserved() bool
        +markAsCollected() bool
    }

    class Order {
        -int orderId
        -DateTime orderDate
        -OrderStatus status
        -SurpriseBag bag
        -PickupWindow pickupTime
        -string pickupCode
        +createOrder() bool
        +updateStatus(status: OrderStatus) bool
        +cancelOrder() bool
        +generatePickupCode() string
        +validatePickupCode(code: string) bool
    }

    class Review {
        -int reviewId
        -float rating
        -string comment
        -DateTime datePosted
        -string storeResponse
        -ReviewStatus status
        -bool wasCollected
        +addReview() bool
        +updateReview() bool
        +addStoreResponse(response: string) bool
    }

    class Location {
        -double latitude
        -double longitude
        -string address
        -string city
        -string postalCode
        -string country
        +updateLocation() bool
        +calculateDistance(Location other) float
        +getNearbySurpriseBags(radius: float) List~SurpriseBag~
    }

    class PickupWindow {
        -DateTime startTime
        -DateTime endTime
        -int availableSlots
        +isAvailable() bool
        +reserveSlot() bool
        +releaseSlot() bool
    }

    %% Enums
    class StoreCategory {
        <<enumeration>>
        RESTAURANT
        BAKERY
        SUPERMARKET
        CAFE
        HOTEL
        OTHER
    }

    class MealType {
        <<enumeration>>
        BREAKFAST
        LUNCH
        DINNER
        BAKERY
        GROCERIES
        MIXED
    }

    class BagStatus {
        <<enumeration>>
        AVAILABLE
        RESERVED
        COLLECTED
        CANCELLED
    }

    %% Relationships
    User <|-- Customer
    User <|-- Store
    Store "1" -- "*" SurpriseBag : offers
    Store "1" -- "1" Location : has
    Store "1" -- "*" PickupWindow : defines
    Customer "1" -- "*" Order : places
    Order "1" -- "1" SurpriseBag : reserves
    Store "1" -- "*" Review : receives
    Customer "1" -- "*" Review : writes
    Customer "1" -- "*" Store : favorites
```

# Activity Diagram for the order process

```mermaid
stateDiagram-v2
    [*] --> BrowseStores: Customer opens app
    BrowseStores --> ViewSurpriseBags: Select store
    ViewSurpriseBags --> CheckAvailability: Find interesting bag

    CheckAvailability --> MakeReservation: Bag available
    CheckAvailability --> BrowseStores: Bag not available

    MakeReservation --> GeneratePickupCode: Confirm reservation
    GeneratePickupCode --> WaitForPickup: Code generated

    WaitForPickup --> VerifyPickup: Customer arrives
    WaitForPickup --> CancelOrder: Customer no-show

    VerifyPickup --> CompleteOrder: Code validated
    VerifyPickup --> DisputeResolution: Issue reported

    CompleteOrder --> RateExperience: Order completed
    RateExperience --> [*]: Review submitted

    DisputeResolution --> RefundProcess: Valid complaint
    RefundProcess --> [*]: Refund issued

    CancelOrder --> RefundProcess: Within time limit
    CancelOrder --> [*]: Past time limit
```

# Sequence Diagram for the reservation process

```mermaid
sequenceDiagram
    participant C as Customer
    participant A as App
    participant S as Store
    participant N as Notification System

    C->>A: Open App
    A->>A: Get Location
    A->>S: Request Nearby Stores
    S-->>A: Return Store List
    A-->>C: Display Stores

    C->>A: Select Store
    A->>S: Request Available Bags
    S-->>A: Return Bag List
    A-->>C: Display Available Bags

    C->>A: Select Bag
    A->>S: Check Real-time Availability
    S-->>A: Confirm Availability
    A-->>C: Show Reservation Details

    C->>A: Confirm Reservation
    A->>S: Create Reservation
    S->>S: Update Inventory
    S-->>A: Confirm Reservation
    A-->>C: Show Pickup Code

    S->>N: Generate Confirmation
    N-->>C: Send Confirmation

    Note over C,N: Before Pickup Time
    N->>C: Send Pickup Reminder

    Note over C,S: At Pickup
    C->>S: Show Pickup Code
    S->>S: Validate Code
    S-->>C: Confirm Pickup

    Note over C,N: After Pickup
    N->>C: Request Review
```

# State Diagram for the surprise bag lifecycle

```mermaid
stateDiagram-v2
    [*] --> Draft: Store creates bag

    Draft --> Published: Store publishes
    Published --> Reserved: Customer reserves

    Reserved --> Collected: Customer picks up
    Reserved --> Cancelled: Customer cancels
    Reserved --> NoShow: Customer doesn't show

    Collected --> Completed: No issues reported
    Collected --> Disputed: Issue reported

    Cancelled --> Published: Return to inventory
    NoShow --> Published: Return to inventory

    Disputed --> Resolved: Issue handled

    Completed --> [*]
    Resolved --> [*]

    state Published {
        [*] --> Available
        Available --> Hidden: Quantity = 0
        Hidden --> Available: Quantity > 0
    }

    state Reserved {
        [*] --> PendingPickup
        PendingPickup --> ReadyForPickup: Within pickup window
        ReadyForPickup --> LatePickup: Past pickup time
    }
```
