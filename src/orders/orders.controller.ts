import { 
    Controller, 
    Post, 
    Body, 
    Param, 
    UseGuards, 
    Request, 
    HttpCode,
    UnauthorizedException, 
    NotFoundException
  } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
  import { 
    ApiBearerAuth, 
    ApiOperation, 
    ApiResponse, 
    ApiTags,
    ApiParam,
    ApiBody,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiConflictResponse
  } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { OrderResponseDto } from './dto/order-response.dto';
import { Order } from './entities/order.entity';
import { ValidatePickupDto } from './dto/validate-pickup.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { StoreService } from 'src/stores/store.service';
  
  @ApiTags('Orders')
  @ApiBearerAuth('access-token')
  @Controller('orders')
  @ApiBearerAuth()
  export class OrdersController {
    constructor(
      private readonly ordersService: OrdersService,
      private readonly storeService: StoreService) {}
  
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.USER)
    @ApiOperation({ 
      summary: 'Create a new order reservation',
      description: 'Creates a new order reservation for a surprise bag. Requires customer authentication.'
    })
    @ApiBody({
      type: CreateOrderDto,
      description: 'Order creation details including the surprise bag ID'
    })
    @ApiResponse({
      status: 201,
      description: 'Order successfully created',
      type: OrderResponseDto
    })
    @ApiResponse({ 
      status: 400, 
      description: 'Bad request - Invalid input or business rule violation'
    })
    @ApiConflictResponse({ 
      description: 'Conflict - Bag not available or already reserved'
    })
    @ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing authentication' })
    async createReservation(
      @Request() req,
      @Body() createOrderDto: CreateOrderDto
    ): Promise<OrderResponseDto> {
      const order = await this.ordersService.createReservation(
        req.user.customerId,
        createOrderDto
      );
      return this.mapToOrderResponse(order);
    }
  
    @Post(':orderId/validate-pickup')
    @UseGuards(AuthGuard('jwt'), RolesGuard)

    @ApiOperation({ 
      summary: 'Validate pickup code for order',
      description: 'Validates the pickup code provided by the customer at the time of pickup.'
    })
    @ApiParam({
      name: 'orderId',
      description: 'ID of the order to validate',
      type: String,
      required: true
    })
    @ApiBody({
      type: ValidatePickupDto,
      description: 'Pickup code validation details'
    })
    @ApiResponse({
      status: 200,
      description: 'Pickup code validated successfully',
      type: OrderResponseDto
    })
    @ApiResponse({ 
      status: 400, 
      description: 'Bad request - Invalid pickup code or order not in valid state'
    })
    @ApiNotFoundResponse({ description: 'Order not found' })
    @HttpCode(200)
    async validatePickup(
      @Param('orderId') orderId: string,
      @Body() validatePickupDto: ValidatePickupDto
    ): Promise<OrderResponseDto> {
      const order = await this.ordersService.validatePickup(
        orderId, 
        validatePickupDto.pickupCode
      );
      return this.mapToOrderResponse(order);
    }
  
    @Post(':orderId/confirm')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.STORE_ADMIN)
    @ApiOperation({ 
      summary: 'Confirm order by store',
      description: 'Allows store owners to confirm pending orders. Requires store authentication.'
    })
    @ApiParam({
      name: 'orderId',
      description: 'ID of the order to confirm',
      type: String,
      required: true
    })
    @ApiResponse({
      status: 200,
      description: 'Order confirmed successfully',
      type: OrderResponseDto
    })
    @ApiForbiddenResponse({ description: 'Forbidden - Not authorized to confirm this order' })
    @ApiNotFoundResponse({ description: 'Order not found' })
    @ApiResponse({ 
      status: 400, 
      description: 'Bad request - Order cannot be confirmed in current state'
    })
    @HttpCode(200)
    async confirmOrder(
      @Request() req,
      @Param('orderId') orderId: string
    ): Promise<OrderResponseDto> {
 
      const store = await this.storeService.findByUserId(req.user.id);
      if (!store) {
        throw new NotFoundException('Store not found for this user');
      }
      const order = await this.ordersService.confirmOrder(orderId, store.storeId);
      return this.mapToOrderResponse(order);
    }
    private mapToOrderResponse(order: Order): OrderResponseDto {
      return {
        orderId: order.orderId,
        status: order.status,
        pickupCode: order.pickupCode,
        orderDate: order.orderDate,
        bag: {
          bagId: order.bag.bagId,
          name: order.bag.name,
          description: order.bag.description,
          originalValue: order.bag.originalValue,
          discountedPrice: order.bag.discountedPrice
        },
        pickupWindow: {
          start: order.bag.pickupStart,
          end: order.bag.pickupEnd
        }
      }}}
